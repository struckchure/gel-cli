use napi::bindgen_prelude::Error;
use napi_derive::napi;
use std::io::Write;
use std::process::Command;

#[napi]
pub fn run(binary_path: String, argv: Vec<String>) -> napi::Result<i32> {
    let output = Command::new(binary_path)
        .args(argv)
        .output()
        .map_err(|err| Error::from_reason(format!("failed to run gel-cli binary: {err}")))?;

    std::io::stdout()
        .write_all(&output.stdout)
        .map_err(|err| Error::from_reason(format!("failed to write stdout: {err}")))?;
    std::io::stderr()
        .write_all(&output.stderr)
        .map_err(|err| Error::from_reason(format!("failed to write stderr: {err}")))?;

    #[cfg(unix)]
    {
        use std::os::unix::process::ExitStatusExt;
        if let Some(code) = output.status.code() {
            return Ok(code);
        }
        if let Some(signal) = output.status.signal() {
            return Ok(128 + signal);
        }
    }

    #[cfg(not(unix))]
    {
        if let Some(code) = output.status.code() {
            return Ok(code);
        }
    }

    Ok(1)
}

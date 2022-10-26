document.getElementById("file").addEventListener("change", function (e) {
    e.preventDefault();
    document.getElementById("submit").submit();
    document.getElementById("submit").reset();
  });

  const onloadAlert = "<%= alert %>";

  if (onloadAlert.length > 0) {
    window.onload = function () {
      Swal.fire({
        title: onloadAlert,
        width: "auto",
        showConfirmButton: true,
        focusConfirm: false,
        confirmButtonColor: "#5865F2",
        confirmButtonText: `Okay!`,
      });
    };
  }
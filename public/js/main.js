$(document).ready(function () {
  AOS.init();

  $('#download-form').on('submit', function (e) {
    e.preventDefault();
    const url = $('#url').val().trim();

    if (!url) {
      Swal.fire('Oops', 'Silakan masukkan URL dulu.', 'warning');
      return;
    }

    $('#loading').show();
    $('#result').hide();

    $.ajax({
      method: 'POST',
      url: '/api/fetch',
      contentType: 'application/json',
      data: JSON.stringify({ url }),
      success: function (res) {
        $('#video-player').attr('src', res.videoUrl);
        $('#download-link').attr('href', res.videoUrl);
        $('#result').fadeIn();
        $('#loading').hide();
      },
      error: function (xhr) {
        $('#loading').hide();
        Swal.fire('Gagal', xhr.responseJSON?.error || 'Terjadi kesalahan.', 'error');
      }
    });
  });
});

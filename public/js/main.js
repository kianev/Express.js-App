$(document).ready(() => {
  $('.delete-article').on('click', (e) => {
      $target = $(e.target)
    let id = $target.attr('data-id')
    $.ajax({
      method: 'DELETE',
      url: '/articles/' + id,
      success: (response) => {
        alert('Deleting article')
        window.location.href='/'
      },
      error: (err) => {
        console.log(err)
      }
    })
  })
})

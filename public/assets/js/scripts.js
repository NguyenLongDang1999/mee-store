$(function () {
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    })

    // Variables
    let uploadedImage = $('#uploaded-image'),
        toastPlacement,
        dataID, action

    const bootstrapSelect = $('.bootstrap-select'),
        imageFileInput = $('.image-file-input'),
        imageFileReset = $('.image-file-reset'),
        toastPlacementExample = $('.toast-placement-ex'),
        actionDialog = $('#action-dialog'),
        btnAction = $('#btn-action')

    // Plugins
    if (bootstrapSelect.length) {
        bootstrapSelect.selectpicker()
    }

    // Methods
    if (uploadedImage) {
        const resetImage = uploadedImage.attr('src')

        imageFileInput.change(function () {
            const getFiles = $(this).prop('files')[0]

            if (getFiles) {
                uploadedImage.attr('src', window.URL.createObjectURL(getFiles))
            }
        })

        imageFileReset.click(function () {
            imageFileInput.val('')
            uploadedImage.attr('src', resetImage)
        })
    }

    actionDialog.on('show.bs.modal', function (event) {
        dataID = $(event.relatedTarget).data('id')
        action = $(event.relatedTarget).data('action')
    })

    $(btnAction).on('click', function (e) {
        e.preventDefault()
        actionDataWithDialog(dataID, action)
    })

    // Functions
    function actionDataWithDialog(dataID, action) {
        $.ajax({
            type: "post",
            url: action,
            data: {data: dataID}
        }).done(function (resp) {
            const toastResult = $('#toast-result'),
                toastType = $('#toast-type')

            if (resp.result) {
                toastType[0].classList.remove('bg-danger')
                toastType[0].classList.add('bg-primary')
            } else {
                toastType[0].classList.remove('bg-primary')
                toastType[0].classList.add('bg-danger')
            }

            oTable.draw()
            actionDialog.modal('hide')
            toastResult[0].textContent = resp.message
            toastPlacement = new bootstrap.Toast(toastPlacementExample);
            toastPlacement.show();
        })
    }
})

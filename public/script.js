$(document).ready(function () {
    // Fetch API data
    $.ajax({
        url: "http://numbersapi.com/1/30/date?json",
        method: "GET",
        success: function (data) {
            $("#api-text").text(data.text);
        },
    });

    // Drag & Drop upload feature
    let uploadArea = $("#upload-area");

    uploadArea.on("click", function () {
        $("#fileInput").click();
    });

    uploadArea.on("dragover", function (e) {
        e.preventDefault();
        $(this).css("background-color", "#d4edda");
    });

    uploadArea.on("dragleave", function () {
        $(this).css("background-color", "#e9ecef");
    });

    uploadArea.on("drop", function (e) {
        e.preventDefault();
        let files = e.originalEvent.dataTransfer.files;
        handleFiles(files);
    });

    $("#fileInput").on("change", function () {
        handleFiles(this.files);
    });

    function handleFiles(files) {
        let formData = new FormData();
        $.each(files, function (index, file) {
            formData.append("images", file);

            let reader = new FileReader();
            reader.onload = function (e) {
                $(".preview").append(`<img src="${e.target.result}" class="img-thumbnail">`);
            };
            reader.readAsDataURL(file);
        });

        // Upload the image to the server
        $.ajax({
            url: "/upload",
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                alert("Upload successful!");
                console.log(response);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("Upload failed!");
                console.error("Error Details:", textStatus, errorThrown, jqXHR.responseText);
            }
        });
    }
});

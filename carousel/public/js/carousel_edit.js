function CarouselEditBlock(runtime, element) {
//    var xmlEditorTextarea = $('.block-xml-editor', element),
//        xmlEditor = CodeMirror.fromTextArea(xmlEditorTextarea[0], { mode: 'xml', lineWrapping: true });


    // On save event function bind
    $(element).find('.save-button').bind('click', function() {

        // collect data here
        var xml = '<carousel>';

        $("#GridView1 tr").each(function (index) {
        var cells = $("td", this);
            if (cells.length > 0) {
                xml += "<"+$("option:selected",cells.eq(0)).text()+">";
                for (var i = 1; i < cells.length; ++i) {
                        if(i==1){
                            xml += "<link>"+$(cells.eq(i)).find('input').val()+"</link>";
                        }
                        else if(i==2){
                            xml += "<description>"+tinyMCE.editors[index-1].getContent()+"</description>";
                            // xml += "<description>"+$(cells.eq(i)).find("textarea").val()+"</description>";
                        }
                }

                xml += "</"+$("option:selected",cells.eq(0)).text()+">";
             }
        });

        xml = xml + '</carousel>';

        var data = {
            'display_name': $(element).find('.edit-display-name').val(),
            'data': xml,
            // xmlEditor.getValue(),
        };

        $('.xblock-editor-error-message', element).html();
        $('.xblock-editor-error-message', element).css('display', 'none');
        var handlerUrl = runtime.handlerUrl(element, 'studio_submit');
        $.post(handlerUrl, JSON.stringify(data)).done(function(response) {
            if (response.result === 'success') {
                window.location.reload(false);
            } else {
                $('.xblock-editor-error-message', element).html('Error: '+response.message);
                $('.xblock-editor-error-message', element).css('display', 'block');
            }
        });

    });

    $(element).find('.cancel-button').bind('click', function() {
        runtime.notify('cancel', {});
    });

    $(element).find('.add').bind('click', function(){
        $('.block:last', element).after("<tr class='block'><td><select name='ddlStatus'><option selected='selected' value='image'>image</option><option value='video'>video</option><option value='document'>document</option></select></td><td><input type='text' value='http://met-content.bu.edu/etr2/content/images/Slide1.JPG'></td><td><textarea class='edit_me'>Some description of image will come here</textarea></td><td style='padding:20px;'><span style='cursor:pointer;' class='remove'>X</span></td></tr>");
        tinymce.init({
            selector: '.block:last textarea',
            menubar: false,
          });
    });

    $(element).find('.remove').bind('click', function() {
        tinyMCE.editors[$(this).parent().parent().find('.edit_me')[0].id].remove();
        $(this).parent().parent().remove();
    });

    $(function($){
            tinymce.init({
                selector: '.edit_me',
            menubar: false,
          });
    });
}

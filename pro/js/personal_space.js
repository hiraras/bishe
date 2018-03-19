$(function () {
  'use strict';
  var console = window.console || { log: function () {} };
  var URL = window.URL || window.webkitURL;
  var imgContainer = $('#imgContainer');
  // Import image
  var $inputImage = $('#inputImage');
  var $image = $('#image');
  var $download = $('#download');
  var originalImageURL = $image.attr('src');
  var uploadedImageType = 'image/jpeg';
  var uploadedImageURL;
  var options = {
    aspectRatio: 1 / 1,
    preview: '.img-preview',
  };
  imgContainer.width($image.width());
  imgContainer.height($image.height());
  //初始化
  $image.cropper(options);
  
  if (URL) {
    $inputImage.change(function (){
      var imgContainer = $('#imgContainer');
      var files = this.files, file;
      
      if(!$image.data('cropper')){
        return;
      }
      
      if(files && files.length){
        file = files[0];
        if(/^image\/\w+$/.test(file.type)){
          uploadedImageType = file.type;
          if (uploadedImageURL){
            URL.revokeObjectURL(uploadedImageURL);
          }
          uploadedImageURL = URL.createObjectURL(file);
					imgContainer.height(400);
					imgContainer.width(400);
          var tempImg = $image.cropper('destroy').attr('src', uploadedImageURL).on('load',function(){
          	imgContainer.width($(this).width());
          	imgContainer.height($(this).height());
          	tempImg.cropper(options);
          });
          $inputImage.val('');
        }else{
          window.alert('Please choose an image file.');
        }
      }
    });
  }else{
    $inputImage.prop('disabled', true).parent().addClass('disabled');
  }
	initBtnEvent();
  
});

function initBtnEvent(){
	$('#btnGetCropper').click(function(){
		var $download = $('#download');
	  var uploadedImageType = 'image/jpeg';
		var $image = $('#image');
    var $this = $(this);
    var data = $this.data();
    var cropper = $image.data('cropper');
    var cropped;
    var result;
    if(cropper && data.method){
      data = $.extend({}, data); // Clone a new one
      cropped = cropper.cropped;
      if(uploadedImageType === 'image/jpeg'){
        if (!data.option) {
          data.option = {};
        }
        data.option.fillColor = '#fff';
      }
      result = $image.cropper(data.method, data.option, data.secondOption);
      var imgURL = result.toDataURL();
      $('#resultImg').attr('src',imgURL);
      if(result){
				//$('#resultImgContainer').html(result);
				//点击下载(通过设置a标签href为文件url)
        if(!$download.hasClass('disabled')){
          $download.attr('href', result.toDataURL(uploadedImageType));
        }
      }
    }
  });
}



var domain = 'http://localhost';
var userId = '';
var userData = {};
$(function () {
  var pageUrl = window.location.href;
	var urlParams = pageUrl.substr(pageUrl.indexOf('?')+1).split('&');
	if(pageUrl.indexOf('userId') == -1){
		window.location.href = domain + '/pro/index.html';
		return ;
	}
	for(var i=0;i<urlParams.length;i++){
		if(urlParams[i].indexOf('userId') !== -1){
			userId = urlParams[i].substr(urlParams[i].indexOf('=')+1);
		}
  }
  $.ajax({
    type: 'get',
    url: domain + '/pro/php/getUserMsg.php',
    async: true,
    data: {
      username: userId
    },
    success: function(result){
      try{
        var data = JSON.parse(result);
      }catch(e){
        console.log(e);
      }
      console.log(data);
      if(data){
        userData = data;
        init();
      }else{
        console.log('用户不存在');
      }
    }
  });
});
function initCropper(){
  'use strict';
  var console = window.console || { log: function () {} };
  var URL = window.URL || window.webkitURL;
  var imgContainer = $('#imgContainer');
  // Import image
  var $inputImage = $('#inputImage');
  var $image = $('#image');
  $image.attr('src',userData.headImg);
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
}

function init(){
  var username = localStorage.getItem('user');
  if(username == userId){
    $('#userHeadImg').click(function(){
      $('#cropperMask').css('display','block');
      initCropper();
    });
    $('#editorUserMsgBtn').click(function(){
      $('#editorMask').css('display','block');
    });
    $('#selectImgBtn').click(function(){
      $('#inputImage').click();
    });
    $('#cancelSelectBtn').click(function(){
      $('#cropperMask').css('display',"none");
      window.location.reload();
    });
    $('#cancelEditorBtn').click(function(){
      $('#editorMask').css('display',"none");
      window.location.reload();
    });
    $('#submitEditorBtn').click(function(){
      var school = $('#inputSchool').val();
      var age = $('#inputAge').val();
      var address = $('#inputAddress').val();
      if(!(school == '' && age == '' && address == '')){
        if(school == ''){
          school = userData.school;
        }
        if(age == ''){
          age = userData.age;
        }
        if(address == ''){
          address = userData.address;
        }
        $.ajax({
          type: 'post',
          url: domain + '/pro/php/updateUserMsg.php',
          async: true,
          data: {
            username: userId,
            school: school,
            age: age,
            address: address
          },
          success: function(result){
            if(result == 'success'){
              $('#editResultTip').html('提交成功');
              setTimeout(function(){
                window.location.reload();
              },300);
            }else{
              $('#editResultTip').html('未知错误');
            }
          }
        });
      }else{
        $('#editResultTip').html('内容为空');
      }
    });
  }else{
    $('#editorUserMsgBtn').css('display','none');
  }
  $('#userNickname').html(userData.nickname);
  $('#userHeadImg').attr('src',userData.headImg);
  $('#barAge').html('吧龄:'+barAge(userData.createDate)+'年');
}

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
      $.ajax({
        type: 'post',
        url: domain + '/pro/php/saveUserHeadImg.php',
        async: true,
        data: {
          fileData: imgURL,
          username: userId
        },
        success: function(result){
          try{
            var data = JSON.parse(result);
          }catch(e){
            console.log(e);
          }
          if(data.result == 'success'){
            window.location.reload();
          }else{
            alert('未知错误');
          }
        }
      });
      /*
      if(result){
				//$('#resultImgContainer').html(result);
				//点击下载(通过设置a标签href为文件url)
        if(!$download.hasClass('disabled')){
          $download.attr('href', result.toDataURL(uploadedImageType));
        }
      }
      */
    }
  });
}



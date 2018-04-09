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
      if(data){
        userData = data;
        init();
      }else{
				console.log('用户不存在');
				window.location.href = "http://localhost/pro/index.html";
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
	var $image = $('#image');
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
			$image.cropper('destroy');
    });
    $('#cancelEditorBtn').click(function(){
			$('#editorMask').css('display',"none");
			$image.cropper('destroy');
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
						console.log(result);
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
		$('#btnInformtion').css('display','none');
    $('#editorUserMsgBtn').css('display','none');
  }
  $('#userNickname').html(userData.nickname);
  $('#userHeadImg').attr('src',userData.headImg);
  $('#barAge').html('吧龄:'+barAge(userData.createDate)+'年');
  $('#featureList li').each(function(index){
    $(this).click(function(){
      switchContent(index);
      $('#featureList li').each(function(i){
        if(i==index){
          $(this).css('border-bottom','none');
        }else{
          $(this).css('border-bottom','1px solid black');
        }
      });
    });
  });
  switchContent(0);
}
function switchContent(num){
  $('.content').each(function(index){
    if(index == num){
      $(this).css('display','block');
    }else{
      $(this).css('display','none');
    }
  });
  switch(num){
    case 0:
      getContentUserMsg();
      break;
    case 1:
      initPagingIndexClick(userId);
      getMyPostData(userId, 0);
      break;
		case 2:
			initMyReplyPostPagingIndexClick(userId);
      getMyReplyPostData(userId, 0);
      break;
    case 3:
      break;
		case 4:
			getMyAttentionBar(userId);
      break;
    default:
      break;
  }
}

function getMyAttentionBar(userId){
		$.ajax({
			url: domain + "/pro/php/getMyAttentionBar.php",
			type: 'get',
			async: true,
			data: {
				userId: userId
			},
			success: function(result){
				try{
					var data = JSON.parse(result);
				}catch(e){
					console.log(e);
				}
				if(data.result){
					for(var i=0;i<data.data.length;i++){
						var $div = $('<div></div>');
						$div.html(data.data[i].barName+'吧');
						$div.attr('barId', data.data[i].barId);
						$div.attr('barName', data.data[i].barName);
						$div.addClass('my_attention_bar_item');
						$div.click(function(){
							window.location.href = "http://localhost/pro/page/bar.html?barName="+$(this).attr('barName');
						});
						$('#contentAttendBar').append($div);
					}
				}
			}
		});
}

function getContentUserMsg(){
  $('#contentUserMsgSchool').html('学校:'+userData.school);
  $('#contentUserMsgAge').html('年龄:'+userData.age);
  $('#contentUserMsgAddress').html('地址:'+userData.address);
}

function getMyPostData(userId,indexNum){
	$.ajax({
		url: domain + "/pro/php/getMyPostData.php",
		type: 'get',
		async: true,
		data: {
			userId: userId,
			indexNum: indexNum
		},
		success: function(result){
			var data = JSON.parse(result);
			if(data.totalNum == 0){
				$('#notExistMyPostTip').css('display','inline');
			}else{
				freshBarItems(data,indexNum);
			}
		}
	});
}

function getMyReplyPostData(userId,indexNum){
	$.ajax({
		url: domain + "/pro/php/getMyReplyPostData.php",
		type: 'get',
		async: true,
		data: {
			userId: userId,
			indexNum: indexNum
		},
		success: function(result){
      try{
				var data = JSON.parse(result);
			}catch(e){
				console.log(e);
			}
			if(data.value.length == 0){
				$('#notExistMyReplyTip').css('display','inline');
			}else{
				// for(var i=0;i<data.value.length;i++){
				// 	if(data.value[i].postName == null){
				// 		data.value.splice(i,1);
				// 		data.totalNum --;
				// 		i--;
				// 	}
				// }
				freshReplyPostItem(data, indexNum);
				console.log(data);
			}
		}
	});
}

function freshReplyPostItem(data, indexNum){
	var pageNum = data.totalNum / data.pageItemNum;
	//是否有页面的内容是只有一部分的
	var isComplete = data.totalNum % data.pageItemNum == 0 ? true: false;
	pageNum = isComplete ? pageNum : Math.floor(pageNum) + 1;
	if(pageNum == 0){
		pageNum = 1;
	}
	$('#myReplyPosts').find('.my_reply_post').remove();
	$('#myReplyPosts').attr('index', indexNum);
	$('#myReplyPosts').attr('totalpagenum', --pageNum);
	for(var i=0;i<data.value.length;i++){
		var $item = createMyReplyPostItem(data.value[i]);
		$('#myReplyPosts').find('.myReplyIndex').before($item);
	}
	initMyReplyIndex();
}

function resizeImg(){
	$(this).siblings("img").each(function(){
		$(this).css('height','100px');
		$(this).css('max-width','134px');
	});
	if($(this).css('height') == '100px'){
		$(this).css('height','400px');
		$(this).css('max-width','900px');
	}else{
		$(this).css('height','100px');
		$(this).css('max-width','134px');
	}
}
function freshBarItems(data, indexNum){
	var pageNum = data.totalNum / data.pageItemNum;
	//是否有页面的内容是只有一部分的
	var isComplete = data.totalNum % data.pageItemNum == 0 ? true: false;
	pageNum = isComplete ? pageNum : Math.floor(pageNum) + 1;
	if(pageNum == 0){
		pageNum = 1;
	}
	$('#contentMyPosts').find('.post').remove();
	$('#contentMyPosts').attr('index', indexNum);
	$('#contentMyPosts').attr('totalpagenum', --pageNum);
	for(var i=0;i<data.value.length;i++){
		var $item = createPostItem(data.value[i]);
		$('#contentMyPosts').find('.myPostsIndex').before($item);
	}
	initIndex();
}

function initPagingIndexClick(userId){
	$('#contentMyPostsPrevBtn').click(function(){
		prevPage(userId);
	});
	$('#contentMyPostsNextBtn').click(function(){
		nextPage(userId);
	});
	$('#contentMyPostsFirstPageBtn').click(function(){
		firstPage(userId);
	});
	$('#contentMyPostsLastPageBtn').click(function(){
		lastPage(userId);
	});
	$('#contentMyPosts .index_item').click(function(){
		var index = Number($(this).html()) - 1;
		getMyPostData(userId,index);
	});
}

function initMyReplyPostPagingIndexClick(userId){
	$('#contentMyReplyPrevBtn').click(function(){
		myReplyPrevPage(userId);
	});
	$('#contentMyReplyNextBtn').click(function(){
		myReplyNextPage(userId);
	});
	$('#contentMyReplyFirstPageBtn').click(function(){
		myReplyFirstPage(userId);
	});
	$('#contentMyReplyLastPageBtn').click(function(){
		myReplyLastPage(userId);
	});
	$('#myReplyPosts .index_item').click(function(){
		var index = Number($(this).html()) - 1;
		getMyReplyPostData(userId,index);
	});
}


function myReplyPrevPage(userId){
	var currIndex = Number($('#myReplyPosts').attr('index'));
	if(currIndex > 0){
		getMyReplyPostData(userId, --currIndex);
	}
}

function myReplyNextPage(userId){
  console.log(userId);
	var currIndex = Number($('#myReplyPosts').attr('index'));
	var totalNum = Number($('#myReplyPosts').attr('totalpagenum'));
	console.log(currIndex, totalNum);
	if(currIndex < totalNum){
		getMyReplyPostData(userId, ++currIndex);
	}
}

function myReplyFirstPage(userId){
	var currIndex = Number($('#myReplyPosts').attr('index'));
	if(currIndex != 0){
		getMyReplyPostData(userId, 0);
	}
}

function myReplyLastPage(userId){
	var currIndex = Number($('#myReplyPosts').attr('index'));
	var totalNum = Number($('#myReplyPosts').attr('totalpagenum'));
	if(currIndex != totalNum){
		getMyReplyPostData(userId, totalNum);
	}
}

function createPostItem(data){
	// console.log(data);
	var maxShowImgNum = 4;
	var imgReg=/<img\b[^>]*postImg[^>]*>/ig;
	var $postDiv = $('<div></div>');
	$postDiv.addClass('post');
	var $postContentDiv = $('<div></div>');
	$postContentDiv.addClass('post_content');
	var $postTitleContainerDiv = $('<div></div>');
	$postTitleContainerDiv.addClass('post_title_container');

	var $isTopP = $('<p></p>');
	$isTopP.addClass('is_top');
	if(data.isTop == '0'){
		$isTopP.css('display','none');
	}
	var $isGreatP = $('<p></p>');
	$isGreatP.addClass('is_great');
	if(data.isGreat == '0'){
		$isGreatP.css('display','none');
	}
	var $postTitleTextP = $('<p></p>');
	$postTitleTextP.addClass('post_title_text');
	$postTitleTextP.html(data.postName);
	$postTitleTextP.click(function(){
		var postId = $(this).parents('.post').attr('postId');
		window.location.href = 'http://localhost/pro/page/post.html?'+'postId='+postId;
	});
	$postTitleContainerDiv.append($isTopP);
	$postTitleContainerDiv.append($isGreatP);
	$postTitleContainerDiv.append($postTitleTextP);

	var $postImgContainerDiv = $('<div></div>');
	$postImgContainerDiv.addClass('post_img_container');
	var $postContentIntroP = $('<p></p>');
	$postContentIntroP.addClass('post_content_intro');
	$postContentIntroP.html(data.postContent.replace(imgReg,''));
	$postImgContainerDiv.append($postContentIntroP);
	var imgArr = data.postContent.match(imgReg);
	if(imgArr){
		for(var j=0;j<imgArr.length && j<maxShowImgNum;j++){
			var $imgEle = $(imgArr[j]);
			$imgEle.addClass('post_img');
			$imgEle.click(resizeImg);
			$postImgContainerDiv.append($imgEle);
		}
	}
	
	$postContentDiv.append($postTitleContainerDiv);
	$postContentDiv.append($postImgContainerDiv);

	var $postMsgDiv = $('<div></div>');
	$postMsgDiv.addClass('post_msg');

	var $masterMsgDiv = $('<div></div>');
	$masterMsgDiv.addClass('master_msg');
	var $postMsgPeopleImg = $('<img />');
	$postMsgPeopleImg.addClass('post_msg_people_img');
	$postMsgPeopleImg.attr('src','../img/proImg/people.png');
	var $masterNameP = $('<p></p>');
	$masterNameP.addClass('master_name');
	$masterNameP.html(data.creatorNickName);
	$masterMsgDiv.append($postMsgPeopleImg);
	$masterMsgDiv.append($masterNameP);

	var $replyNumMsgDiv = $('<div></div>');
	$replyNumMsgDiv.addClass('reply_num_msg');
	var $postMsgReplyImg = $('<img />');
	$postMsgReplyImg.addClass('post_msg_reply_img');
	$postMsgReplyImg.attr('src','../img/proImg/msg.png');
	var $replyNumP = $('<p></p>');
	$replyNumP.addClass('reply_num');
	$replyNumP.html(data.replyNum);
	$replyNumMsgDiv.append($postMsgReplyImg);
	$replyNumMsgDiv.append($replyNumP);

	var $postTimeDiv = $('<div></div>');
	var showCreateTimeStr = '';
	$postTimeDiv.addClass('post_time');
	if(isToday(data.createTime)){
		showCreateTimeStr = data.createTime.substr(11);
	}else{
		showCreateTimeStr = data.createTime.substr(0,10);
	}
	$postTimeDiv.html(showCreateTimeStr);

	$postMsgDiv.append($masterMsgDiv);
	$postMsgDiv.append($replyNumMsgDiv);
	$postMsgDiv.append($postTimeDiv);

	$postDiv.append($postContentDiv);
	$postDiv.append($postMsgDiv);
	$postDiv.attr('postId',data.id);
	$postDiv.attr('postId',data.id);
	return $postDiv;
}
function initIndex(){
	var maxShowIndex = 10;
	var currIndex = Number($('#contentMyPosts').attr('index'));
	var totalNum = Number($('#contentMyPosts').attr('totalpagenum'));
	var halfIndexNum = Math.floor(maxShowIndex / 2) + 1;
	if(currIndex == 0){
		$('#contentMyPostsPrevBtn').css('display','none');
		$('#contentMyPostsFirstPageBtn').css('display','none');
	}else{
		$('#contentMyPostsPrevBtn').css('display','inline-block');
		$('#contentMyPostsFirstPageBtn').css('display','inline-block');
	}
	if(currIndex == totalNum){
		$('#contentMyPostsNextBtn').css('display','none');
		$('#contentMyPostsLastPageBtn').css('display','none');
	}else{
		$('#contentMyPostsNextBtn').css('display','inline-block');
		$('#contentMyPostsLastPageBtn').css('display','inline-block');
	}
	$('#contentMyPosts .index_item').removeClass('currIndex');
	
	if(totalNum < maxShowIndex){
		$('#contentMyPosts .index_item').each(function(index){
			if(index > totalNum){
				$(this).css('display','none');
			}
			if(index == currIndex){
				$(this).addClass('currIndex');
			}
		});
	}else{
		if(currIndex < halfIndexNum){
			$('#contentMyPosts .index_item').each(function(index){
				$(this).html(index + 1);
			});
		}else if(currIndex > totalNum - halfIndexNum){
			$('#contentMyPosts .index_item').each(function(index){
				$(this).html(totalNum + 1 - (maxShowIndex - 1 - index));
			});
		}else{
			$('#contentMyPosts .index_item').each(function(index){
				$(this).html(currIndex + 1 - (halfIndexNum - index - 1));
			});
		}
		$('#contentMyPosts .index_item').each(function(index){
			if($(this).html() == currIndex + 1){
				$(this).addClass('currIndex');
			}
		});
	}
}

function initMyReplyIndex(){
	var maxShowIndex = 10;
	var currIndex = Number($('#myReplyPosts').attr('index'));
	var totalNum = Number($('#myReplyPosts').attr('totalpagenum'));
	var halfIndexNum = Math.floor(maxShowIndex / 2) + 1;
	if(currIndex == 0){
		$('#contentMyReplyPrevBtn').css('display','none');
		$('#contentMyReplyFirstPageBtn').css('display','none');
	}else{
		$('#contentMyReplyPrevBtn').css('display','inline-block');
		$('#contentMyReplyFirstPageBtn').css('display','inline-block');
	}
	if(currIndex == totalNum){
		$('#contentMyReplyNextBtn').css('display','none');
		$('#contentMyReplyLastPageBtn').css('display','none');
	}else{
		$('#contentMyReplyNextBtn').css('display','inline-block');
		$('#contentMyReplyLastPageBtn').css('display','inline-block');
	}
	$('#myReplyPosts .index_item').removeClass('currIndex');
	
	if(totalNum < maxShowIndex){
		$('#myReplyPosts .index_item').each(function(index){
			if(index > totalNum){
				$(this).css('display','none');
			}
			if(index == currIndex){
				$(this).addClass('currIndex');
			}
		});
	}else{
		if(currIndex < halfIndexNum){
			$('#myReplyPosts .index_item').each(function(index){
				$(this).html(index + 1);
			});
		}else if(currIndex > totalNum - halfIndexNum){
			$('#myReplyPosts .index_item').each(function(index){
				$(this).html(totalNum + 1 - (maxShowIndex - 1 - index));
			});
		}else{
			$('#myReplyPosts .index_item').each(function(index){
				$(this).html(currIndex + 1 - (halfIndexNum - index - 1));
			});
		}
		$('#myReplyPosts .index_item').each(function(index){
			if($(this).html() == currIndex + 1){
				$(this).addClass('currIndex');
			}
		});
	}
}

function prevPage(userId){
	var currIndex = Number($('#contentMyPosts').attr('index'));
	if(currIndex > 0){
		getMyPostData(userId, --currIndex);
	}
}

function nextPage(userId){
  console.log(userId);
	var currIndex = Number($('#contentMyPosts').attr('index'));
	var totalNum = Number($('#contentMyPosts').attr('totalpagenum'));
	console.log(currIndex, totalNum);
	if(currIndex < totalNum){
		getMyPostData(userId, ++currIndex);
	}
}

function firstPage(userId){
	var currIndex = Number($('#contentMyPosts').attr('index'));
	if(currIndex != 0){
		getMyPostData(userId, 0);
	}
}

function lastPage(userId){
	var currIndex = Number($('#contentMyPosts').attr('index'));
	var totalNum = Number($('#contentMyPosts').attr('totalpagenum'));
	if(currIndex != totalNum){
		getMyPostData(userId, totalNum);
	}
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

function createMyReplyPostItem(data){
	// console.log(data);
	var imgReg=/<img\b[^>]*postImg[^>]*>/ig;
	var $myReplyPostDiv = $('<div></div>');
	$myReplyPostDiv.addClass('my_reply_post');
	$myReplyPostDiv.attr('postId',data.postBelongId);
	var $replyPostFromContainerDiv = $('<div></div>');
	$replyPostFromContainerDiv.addClass('reply_post_from_container');
	var $replyPostNameSpan = $('<span></span>');
	$replyPostNameSpan.addClass('reply_post_name');
	$replyPostNameSpan.html(data.postName);
	$replyPostNameSpan.click(function(){
		var postId = $(this).closest('.my_reply_post').attr('postId');
		window.location.href = 'http://localhost/pro/page/post.html?'+'postId='+postId;
	});
	var $replyPostBarBelongSpan = $('<span></span>');
	$replyPostBarBelongSpan.addClass('reply_post_bar_belong');
	$replyPostBarBelongSpan.html('来自:'+data.barBelong+'吧');
	var $replyPostContentP = $('<p></p>');
	$replyPostContentP.addClass('reply_post_content');
	var content = data.content.replace(imgReg,'');
	$replyPostContentP.html('回复内容:'+content);
	var $replyPostTimeP = $('<p></p>');
	$replyPostTimeP.addClass('reply_post_time');
	var replyTime = data.createTime;
	if(isToday(replyTime)){
		replyTime = replyTime.substr(11);
	}else{
		replyTime = replyTime.substr(0,10);
	}
	$replyPostTimeP.html('回复时间:'+replyTime);

	$replyPostFromContainerDiv.append($replyPostNameSpan);
	$replyPostFromContainerDiv.append($replyPostBarBelongSpan);
	$myReplyPostDiv.append($replyPostFromContainerDiv);
	$myReplyPostDiv.append($replyPostContentP);
	$myReplyPostDiv.append($replyPostTimeP);
	return $myReplyPostDiv;
}

/**
 * Fri Mar 29, 2013 10:37:19 added by Thanh Son 
 * Email: thanhson1085@gmail.com 
 */
var o_error;
var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i) ? true : false;
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i) ? true : false;
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i) ? true : false;
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() 
				|| isMobile.iOS() || isMobile.Windows());
    }
};
$(document).ready(function(){
	var dob_theme = 'android';
	if (isMobile.iOS()) dob_theme = 'ios';
    $('#dob').mobiscroll().date({
        invalid: { daysOfWeek: [0, 6], daysOfMonth: ['5/1', '12/24', '12/25'] },
        theme: dob_theme,
        display: 'bottom',
        mode: 'scroller',
        dateOrder: 'yy M dd',
		dateFormat: 'dd/mm/yy'
    });    
	$('select.date-of-birth').change(function(){
		$('#dob').val($('select[name="dob_day"] option:selected').val() + "/" + 
					$('select[name="dob_month"] option:selected').val() + "/" + 
					$('select[name="dob_year"] option:selected').val());
	});
	$('button[type="submit"]').bind('click', function(e){
		e.preventDefault();	
		var submit_flag = validateFormOnSubmit();
        myurl = 'media/class/post.php'; 
        if(submit_flag){
            $.ajax({           
               type: "POST",
               url: myurl,     
               data: $("#od-form").serialize(),
               success: function(data){        
					console.log('success');
               },
               error: function(data){          
        
               }
             });
        }
	});
	current_time = new Date();
	current_year = current_time.getFullYear();
	for (var i=current_year;i>=(current_year-110);i--) {
		$('#od-year')
		.append($("<option></option>")
		.attr("value",i)
		.text(i)); 
	}
});
function validateFormOnSubmit() {
    var b = true; 
	o_error = null;
    b = b & validateTextarea($('.text-tell-us'));
    b = b & validateEmpty($('.input-required1'));
	b = b & validateEmail($('.input-email'));
	b = b & validatePhone($('.input-mobile'));
    b = b & validateEmpty($('.input-required2'));
	b = b & validatePostcode($('.input-postcode'));
	b = b & validateSelector($('.select-required'));
	b = b & validateDob($('#dob'));
	b = b & validateCheckbox($('.checkbox-required'));
	if (!b){
		o_error.focus();
	}
    return b;
}

function validateDob(fld) {
    var re = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
    var b = true;
	var current_year = (new Date()).getFullYear();

    fld.each(function(){
        b = true;
		var o_this = $(this);
		removeNotify(o_this);
        if(o_this.val() != '') {
            if(regs = o_this.val().match(re)) {
                if((regs[1] < 1 || regs[1] > 31) ||
                	(regs[2] < 1 || regs[2] > 12) ||
                	(regs[3] < (current_year - 110) || regs[3] > current_year)) {
					addNotify(o_this, 'control-invalid');
                    b = false;
                }
                if(calcAge(+new Date(regs[3], regs[2], regs[1])) < 18) {
					addNotify(o_this, 'control-over18');
                    b = false;
                }
            }
            else{
				addNotify(o_this, 'control-invalid');
                b = false;
            }
        }
        else{
			addNotify(o_this, 'control-blank');
            b = false;
        }
		if(!b){
            o_error = (o_error)?o_error:o_this;
		}
    });
    return b;
}

function validateSelector(fld){
	var b = true;
	fld.each(function(){
		removeNotify($(this));
		option_selected = $(this).children(':selected');
		if (option_selected.length && option_selected.val() == "") {
			addNotify($(this),'control-blank');
			o_error = (o_error)?o_error:$(this);
			b = false;
		}
	});
	return b; 
}


function validateCheckbox(fld){
	var b = true;
	fld.each(function(){
		removeNotify($(this));
		if (!$(this).prop('checked')){
			addNotify($(this),'control-blank');
			o_error = (o_error)?o_error:$(this);
			b = false;
		}
	});
	return b; 
}

function validateEmpty(fld) {
	var b = true;
	fld.each(function(){
		removeNotify($(this));
		if ($(this).val() == 'Required' || $(this).val() == '') {
			addNotify($(this), 'control-blank');
			o_error = (o_error)?o_error:$(this);
			b = false;
		}
	});
	return b; 
}

function validateTextarea(fld) {
	var b = true;
	fld.each(function(){
        var str = trim1($(this).val()).split(/[^a-zA-Z0-9'-]+/);
		removeNotify($(this));
		if(str.length > 24){
			addNotify($(this), 'control-invalid');
			o_error = (o_error)?o_error:$(this);
			b = false;
		} 
		else if ($(this).val() == '') {
			addNotify($(this), 'control-blank');
			o_error = (o_error)?o_error:$(this);
			b = false;
		} 
	});
	return b; 
}
function validateEmail(fld) {
	var b = true;
    var tfld = fld.val();
	removeNotify(fld);
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;

    if (tfld == "") {
		b = false;
		addNotify(fld, 'control-blank');
		o_error = (o_error)?o_error:fld;
		return b;
    }
	if (!re.test(tfld)) {
		b = false;
    } 
	else {
		b = true;
    }
	if (!b){
		addNotify(fld, 'control-invalid');
		o_error = (o_error)?o_error:fld;
	}
    return b;
}
function validatePhone(fld) {
	var b = true;
    var stripped = fld.val();
	removeNotify(fld);

   if (fld.val() == "") {
		b = false;
		addNotify(fld, 'control-blank');
		o_error = (o_error)?o_error:fld;
		return b;
    }
	if (stripped.match(/\s/g)) {
		b = false;
    } else if (!stripped.match(/^0/g)) {
		b = false;
    } else if (isNaN(parseInt(stripped))) {
		b = false;
    } else if (stripped.length != 10) {
		b = false;
    }
	
	if (!b){
		addNotify(fld, 'control-invalid');
		o_error = (o_error)?o_error:fld;
	}
    return b; 
}

function validatePostcode(fld) {
	var b = true;
    var stripped = fld.val();
	removeNotify(fld);
   if (stripped == "") {
		b = false;
		addNotify(fld, 'control-blank');
		o_error = (o_error)?o_error:fld;
		return b;
    }

	if (isNaN(parseInt(stripped))) {
		b = false;
    }
	else if (stripped.match(/\s|[.]|[-]/g)) {
		b = false;
    }
	else if (stripped.length != 4) {
		b = false;
	}
	if (!b){
		addNotify(fld, 'control-invalid');
		o_error = (o_error)?o_error:fld;
	}
    return b; 
}
function removeNotify(fld){
	var control_group = fld.parents('.control-group');
	control_group.removeClass('form-error').removeClass('control-blank').removeClass('control-invalid');
}
function addNotify(fld, e_type){
	var control_group = fld.parents('.control-group');
	switch(e_type){
		case 'control-invalid':
			control_group.addClass('form-error control-invalid');
			break;
		case 'control-blank':
			control_group.addClass('form-error control-blank');
			break;
		default:
			control_group.addClass('form-error control-blank');
			break;
	}
}
function calcAge(birthday) {
  return ~~((Date.now() - birthday) / (24 * 3600 * 365.25 * 1000));
}
function trim1 (str) {
    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}
function word_count(obj){
    total_words = trim1(obj.value).split(/[^a-zA-Z0-9'-]+/).length;
	return total_words;
};

(function($){  
	$.fn.webforms2 = function(options) { 
		var webform2Implemented = false;
		if(document.implementation && document.implementation.hasFeature && document.implementation.hasFeature('WebForms', '2.0')) {
			webform2Implemented = true;
		}
		
		var defaults = {
			doDateTimeLocal: !webform2Implemented,
			doDate: !webform2Implemented,			
			doTime: !webform2Implemented,			
			doNumber: !webform2Implemented,		
			doRange: !webform2Implemented,		
			doEmail: !webform2Implemented,		
			doUrl: !webform2Implemented,			
			doTel: !webform2Implemented,	
			doColor: !webform2Implemented,
			doPattern: !webform2Implemented,
			datepickerOptions:{},
			dateSep: '.',

			doRange: true,
			warningDateNotCorrect: 'The date {0} is not legal',
			warningDateIsLowerThenAllowed: 'The date you selected is before the date({0}) that is available',
			warningDateIsHigherThenAllowed: 'The date you selected is after the date({0}) that is available',

			timeOptions:{
				trigger:'click'
			},
			warningTimeIsNotCorrect: 'The time you selected is not legal, please check if {0} is correct',

			warningNotANumber: '{0} is not a number',
			warningNumberIsLowerThenAllowed:'{0} is to low, the mininum number is {1}',
			warningNumberIsHigherThenAllowed:'{0} is to high, the maximum number is {1}',

			warningEmailNotLegal:'{0} is not a legal email',

			warningUrlNotLegal:'{0} is not a legal url',
			warningTelephoneNotLegal:'{0} is not a legal phonenumber',
			infoWarning: '"{1}" in the box {0} is not legal. ',
			inputBackgroundColor:'#d91f26',
			inputWarningImage:'images/warning.png',
			warningInputIsRequired:'Box cannot be empty',
			warningPleaseFillInput:'Please write something into the box {0}',
			warningPleaseSelectCheckbox:'Please check the box {0}',
			
			cssPath:'/css/',
			jsPath:'js/'
		};

		var options = $.extend(defaults, options);  



		return this.each(function() {  
			$.include(
				[
					options.cssPath + "jquery-ui-1.7.2.custom.css",
					options.cssPath + "ui.timepickr.css",
					options.jsPath + "ui.core.js",
					options.jsPath + "jquery-ui-1.7.2.custom.min.js", 
					options.jsPath + "ui.datepicker.js",
					options.jsPath + "jquery.utils.js",
					options.jsPath + "jquery.strings.js", 
					options.jsPath + "ui.timepickr.js"
				], function() {
					var form = $('form');
					form.bind('submit', validateFormBeforeSubmit);
					
					var inputs =  $(form.selector + ' :input');
					inputs.each( function(i) {
						setValidateOnBox(inputs[i]);
					});
				});
		}); 
		

		function setValidateOnBox(input) {
			var box = $(input);
			

			var regex		= box.attr('pattern');
			var required	= box.attr('required');
			var type        = input.getAttribute('type');
			if (input.tagName.toLowerCase() == 'select') type = 'select';
			if (input.tagName.toLowerCase() == 'textarea') type = 'textarea';
			if (type == null) type = 'text';
			
			var minDate = null;
			var maxDate = null;
			if (type == 'date' || type.indexOf('datetime') != -1) {
				if (typeof box.attr("min") == typeof '') {
					var min = box.attr("min").split('-');
					minDate = new Date(min[0], parseInt(min[1])-1, min[2]);
				}
				if (typeof box.attr("max") == typeof '') {
					var max = box.attr("max").split('-');
					maxDate = new Date(max[0], parseInt(max[1])-1, max[2]);
				}
			}

			if (type == 'date' && options.doDate) {
				box.attr('size', '10');

				if (maxDate != null) options.datepickerOptions.maxDate = maxDate;
				if (minDate != null) options.datepickerOptions.minDate = minDate;
				box.datepicker(options.datepickerOptions);

			} else if (type == 'datetime-local' && options.doDateTimeLocal) {
				var parent = box.parent();
				if ($('#datetime-local_date_' + box.attr('id')).length == 0) {
					var val = box.val();
					var required = box.attr('required');
					
					var strDate = '';
					if (val != '') {
						strDate = val.split('T')[0].split('-');
					}
					var dateInput = document.createElement('input');
					dateInput.id = 'datetime-local_date_' + box.attr('id');
					dateInput.setAttribute('type', 'date-local');
					dateInput.setAttribute('required', required);
					dateInput.setAttribute('rel', box.attr('id'));
					dateInput.size = 10;
					if (strDate != '') {
						dateInput.value = getShortDatePattern(new Date(strDate[0], strDate[1] - 1, strDate[2]));
					}
					box.before(dateInput);

					var timeInput = document.createElement('input');
					timeInput.id = 'datetime-local_time_' + box.attr('id');
					timeInput.setAttribute('type', 'time-local');
					timeInput.setAttribute('required', required);
					timeInput.setAttribute('rel', box.attr('id'));
					timeInput.setAttribute('autocomplete', 'off');
					timeInput.size = 10;
					if (val != '') {
						timeInput.value = val.split('T')[1];
					}

					box.before(timeInput);

					box.css('display', 'none');

					$('#datetime-local_time_' + box.attr('id')).timepickr(options.timeOptions);

					if (maxDate != null) options.datepickerOptions.maxDate = maxDate;
					if (minDate != null) options.datepickerOptions.minDate = minDate;
					$('#datetime-local_date_' + box.attr('id')).datepicker(options.datepickerOptions);
				}
			} else if (type == 'time' && options.doTime) {
				if (box.attr('size') == 0) box.attr('size', '6');
				box.attr('autocomplete', 'off');
				box.timepickr(options.timeOptions);
			} else if (type == 'number' && options.doNumber) {
				if (box.attr('size') == 0) box.attr('size', '6');
			} else if (type == 'url' && options.doUrl) {
				if (box.attr('size') == 0) box.attr('size', '45');
			} else if (type == 'color' && options.doColor) {
				if (box.attr('size') == 0) box.attr('size', '7');

				$.include(
				 [
					 options.cssPath + 'colorpicker.css',
					 options.jsPath + 'jquery.colorpicker.js'
				 ],
				 function() {
					
						box.ColorPicker({

							   onSubmit: function(hsb, hex, rgb, el) {
								   box.val('#' + hex);
								   $('.colorpicker').css('display', 'none');
							   },
							   onBeforeShow: function() {
								   $(this).ColorPickerSetColor(this.value.replace('#', ''));
							   } 
						 });
				 });
			} else if (type == 'range2' && options.doRange) {
				if (box.attr('size') == 0) box.attr('size', '6');
				var div = document.createElement('div');
				div.id = 'slider_' + input.id;
				div.className = 'uiSlider';
				box.parent().append($(div));
				var val = box.val();
				if (val == '' && box.attr('min') != '' && typeof box.attr('min') != 'undefined') {
					val = box.attr('min');
				} else if (val == '') {
					val = 1;
				}
				var min = 1;
				var max = 100;
				var step = 1;
				if (typeof box.attr('min') != 'undefined') {
					min = parseFloat(box.attr('min'));
				}
				if (typeof box.attr('max') != 'undefined') {
					max = parseFloat(box.attr('max'));
				}
				if (typeof box.attr('step') != 'undefined') {
					step = parseFloat(box.attr('step'));
				}
				$(div).slider({
					orientation: 'horizontal',
					value:parseFloat(val),
					step: parseFloat(step),
					min: parseFloat(min),
					max: parseFloat(max),
					slide: function(event, ui) {
						box.val(ui.value);
						if (box.attr('onchange') != '') {
							box.trigger('change');
						}
					}
				});
			} else if (type == 'textarea' && typeof box.attr('maxlength') != 'undefined') {
				box.keyup(function(){
					var max = parseInt(box.attr('maxlength'));
					if(box.val().length > max) {
						box.val(box.val().substr(0, max));
					}
				});
				box.keydown(function(event){
					var max = parseInt(box.attr('maxlength'));
					if((box.val().length >= max && event.keyCode >= 49) || (box.val().length >= max && event.keyCode == 32)) {
						return false;
					}
				});
			}
			
			if (required == 'required' || required == true) {
				if (getLabel(box).text().indexOf('*') == -1) {
					getLabel(box).append('<em>*</em>');
				}
			}
			/*
			//Need to make the placeholder a layer over the input box
			//or something similar. Cannot keep the content of the placeholder in 
			//the box when submitted.

			var placeholder = box.attr('placeholder');
			if (typeof placeholder != 'undefined') {
				if (box.val() == '') {
					var oldColor = box.css('color');
					
					box.val(placeholder);
					box.css('color', 'lightgray');
					box.bind('focus', function(event) {
						box.val('');
						box.unbind('focus');
						box.css('color', oldColor);
					});

					box.bind('blur', {placeholder:placeholder, oldColor:oldColor}, function(event) {
						if (box.val() == '') {
							box.val(event.data.placeholder);
							box.css('color', 'lightgray');
							box.bind('focus', function(event) {
								box.val('');
								box.unbind('focus');
								box.css('color', oldColor);
							});
						} else {
							box.css('color', oldColor);
							box.unbind('focus');
						}
					});
				}
			}
			*/

			var autofocus = box.attr('autofocus');
			if (autofocus == 'autofocus') {
				box.focus();
			}
		}

		function getLabel(obj) {
			return $('label[for=' + obj.attr('id') + ']');
		}
		function getLabelText(obj) {
			return $('label[for=' + obj.attr('id') + ']').text();
		}

		function getDate(value) {
			var parts = value.split(options.dateSep);

			var yearIndex =	(options.datepickerOptions.dateFormat.indexOf('yy') == 0) ? 0 : (options.datepickerOptions.dateFormat.indexOf('yy') == 3) ? 1 : 2;
			var monthIndex= (options.datepickerOptions.dateFormat.indexOf('mm') == 0) ? 0 : (options.datepickerOptions.dateFormat.indexOf('mm') == 3) ? 1 : 2;
			var dayIndex =	(options.datepickerOptions.dateFormat.indexOf('dd') == 0) ? 0 : (options.datepickerOptions.dateFormat.indexOf('dd') == 3) ? 1 : 2;  

			try {
				if (parts[yearIndex] == '' || parts[monthIndex] == '' || parts[dayIndex] == '') return null;
				if (parts[yearIndex].length < 4) return null;

				var date = new Date(parts[yearIndex], parseInt(parts[monthIndex])-1, parts[dayIndex]);
				if (new String(date.getDate()) == 'NaN') {
					return null;
				} else {
					return date;
				}
			} catch (e) {
				return null;
			}
		}

		function getShortDatePattern(date) {
			var dateString = '';
			var yearIndex =	(options.datepickerOptions.dateFormat.indexOf('yy') == 0) ? 0 : (options.datepickerOptions.dateFormat.indexOf('.yy') == 2) ? 1 : 2;
			var monthIndex= (options.datepickerOptions.dateFormat.indexOf('mm') == 0) ? 0 : (options.datepickerOptions.dateFormat.indexOf('.mm') == 2) ? 1 : 2;
			var dayIndex =	(options.datepickerOptions.dateFormat.indexOf('dd') == 0) ? 0 : (options.datepickerOptions.dateFormat.indexOf('.dd') == 2) ? 1 : 2;  

			for (var i=0;i<3;i++) {
				if (i != 0) dateString += options.dateSep;
				if (i == yearIndex) dateString += date.getFullYear();
				if (i == monthIndex) dateString += date.getMonth()+1;
				if (i == dayIndex) dateString += date.getDate();
			}
			return dateString;
		}


		function validateInput(rawInput, labelText) {
			var input = $(rawInput);
			if ($.trim(input.val()) != input.val() && input.attr('type') != 'textarea') {
				input.val('');
			}

			var type = rawInput.getAttribute('type');
			if (rawInput.tagName.toLowerCase() == 'select') type = 'select';
			
			var msg = '';
			var value = input.val();

			if (type == 'date-local' && options.doDate) {
				if (value != '') {
					var tmpDate = getDate(input.val());
					$('#' + input.attr('rel')).val(tmpDate);
				}
			} else if (type == 'time-local' && options.doDate) {
				if (value != '') {
					$('#' + input.attr('rel')).val($('#' + input.attr('rel')).val() + 'T' + input.val());
				}
			} else if (type == 'date' && options.doDate) {
				if (value != '') {
					var date = getDate(value);

					if (date == null) {
						msg = options.warningDateNotCorrect.replace('{0}', value);
					}

					if (msg == '' && input.attr("min") != '' && typeof(input.attr("min")) != 'undefined') {
						var minValue = input.attr("min").split('-');
						var minDate = new Date(minValue[0], parseInt(minValue[1]) - 1, minValue[2]);

						if (minDate > date) {
							msg = options.warningDateIsLowerThenAllowed.replace('{0}', getShortDatePattern(minDate));
						}
					}

					if (msg == '' && input.attr("max") != '' && typeof(input.attr("max")) != 'undefined') {

						var maxValue = input.attr("max").split('-');
						var maxDate = new Date(maxValue[0], parseInt(maxValue[1]) - 1, maxValue[2]);

						if (maxDate < date) {
							msg = options.warningDateIsHigherThenAllowed.replace('{0}', getShortDatePattern(maxDate));
						}
					}
				}
			} else if (type == 'time' && options.doTime) {
				if (value != '') {
					var filter = /^[0-9]{1,2}:[0-9]{2}$/;
					if (!filter.test(value)) {
						msg = options.warningTimeIsNotCorrect.replace('{0}', input.value);
					}
				}
			} else if ((type == 'number' && options.doNumber) || (type == 'range2' && options.doRange)) {
				var filter = /^-?(\d+\.)?\d+(,\d+)?$/;
				if (value != '') {
					if (!filter.test(value)) {
						msg = options.warningNotANumber.replace('{0}', value);
					} else if (input.attr('min') || input.attr('max')) {
						if (input.attr('min') && parseFloat(value) < parseFloat(input.attr('min'))) {
							msg = options.warningNumberIsLowerThenAllowed.replace('{0}', value).replace('{1}', input.attr('min'));
						} else if (input.attr('max') && parseFloat(value) > parseFloat(input.attr('max'))) {
							msg = options.warningNumberIsHigherThenAllowed.replace('{0}', value).replace('{1}', input.attr('max'));
						}
					}
				}

			} else if (type == 'email' && options.doEmail) {
				var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
				if (value != '' && !filter.test(value)) {
					msg = options.warningEmailNotLegal.replace('{0}', value);
				}
			} else if (type == 'url' && options.doUrl) {
				var regexp = /^((ftp|http|https):\/\/)?\w+\.[\.\w]*\w.*$/;
				if (value != '' && !regexp.test(value)) {
					msg = options.warningUrlNotLegal.replace('{0}', value);
				}
			} else if (type == 'tel' && options.doTel) {
				var filter = /^\+?\d+$/;
				if (value != '' && !filter.test(value)) {
					msg = options.warningTelephoneNotLegal.replace('{0}', value);
				}
			}
			if (msg != '') {
				return informError(input, msg);
			} else {
				resetInput(input);
			}

			if (typeof(input.attr('pattern')) != 'undefined' && input.attr('pattern') != "" && options.doPattern) {

				var regex = new RegExp('^(?:' + input.attr('pattern') + ')$');
				if (!regex.test(value)) {
					var explain = input.attr('title');
					return informError(input, options.infoWarning.replace('{0}', labelText).replace('{1}', value) + explain);
				} else {
					resetInput(input);
				}
			}
			return true;

		};



		function informError(input, txt) {
			focusInput(input, txt, true);
			if (showAlert) alertBox(txt);

			return false;
		};

		function alertBox(txt) {
			alert(txt);
		}

		function resetInput(input) {
			if (typeof (input.data('backgroundColor')) != 'undefined') {
				input.css('backgroundColor', input.data('backgroundColor'));
				if ($('#warning_img_' + input.attr('id')).length > 0) $('#warning_img_' + input.attr('id')).remove();
			}
		};

		function focusInput(input, warningText) {
			focusInput(input, warningText, true);
		};

		function focusInput(input, warningText, setFocus) {
			if (setFocus) input.focus();
			
			input.data('backgroundColor', input.css('backgroundColor'));
			input.css('backgroundColor', options.inputBackgroundColor);  //jQuery

			if ($('warning_img_' + input.attr('id'))) {
				$('#warning_img_' + input.attr('id')).remove();
			}

			var span = document.createElement('span');
			span.setAttribute('style', 'float:none;display:inline;');
			span.id = 'warning_img_' + input.attr('id');
			span.innerHTML = ' <img src="' + options.inputWarningImage + '" alt="' + warningText + '" title="' + warningText + '" /> ';
			input.after(span); //jQuery

		};

		function validateBox(input, value) {
			var labelText = getLabelText(input);
			var required  = input.getAttribute('required');

			if ((required == 'required'  || required == true) && $.trim(value) == '') {
				focusInput(input, options.warningInputIsRequired, false);
				return false;
			}
			if (!validateInput($(input), labelText)) {return false;}

			resetInput($(input));
		};

		function setRequired(id) {
			$('#' + id).attr('required', 'required');
			setValidateOnBox($('#' + id));
		}
		function removeRequired(id) {
			$('#' + id).attr('required', '');
			setValidateOnBox($('#' + id));
		}

		function isNotFilled(rawInput) {
			var type = rawInput.getAttribute('type');
			if (type == 'checkbox') {
				return (rawInput.checked==false);
			} else {
				return ($.trim($(rawInput).val()) == '');
			}
		}

		function validateFormBeforeSubmit() {

			showAlert = true;
			var returnStatus = true;
			var inputs = $($(this).selector + ' :input');
			inputs.each(function(i) {
				var box = $(inputs[i]);
				var labelText = getLabelText(box);
				var required = box.attr('required');
				if ((required == 'required' || required == true) && isNotFilled(inputs[i])) {
					if (box.attr('type') == 'checkbox') {
						alertBox(options.warningPleaseSelectCheckbox.replace('{0}', labelText.replace('*', '')));
					} else {
						alertBox(options.warningPleaseFillInput.replace('{0}', labelText.replace('*', '')));
					}
					focusInput(box);
					showAlert = false;
					returnStatus = false;
				}

				if (returnStatus && !validateInput(inputs[i], labelText)) {
					showAlert = false;
					returnStatus = false;
				}

				if (!returnStatus) {
					inputs[i].focus();
					return false;
				}
			});

			if (returnStatus && typeof isOk == 'function') {
				returnStatus = isOk();
			}

			return returnStatus;
		};

	};  
})(jQuery); 





/*
 * includeMany 1.2.0
 *
 * Copyright (c) 2009 Arash Karimzadeh (arashkarimzadeh.com)
 * Licensed under the MIT (MIT-LICENSE.txt)
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Date: Mar 14 2009
 */
(function($){$.chainclude=function(urls,finaly){var onload=function(callback,data){if(typeof urls.length!="undefined"){if(urls.length==0){return $.isFunction(finaly)?finaly(data):null}urls.shift();return $.chainclude.load(urls,onload)}for(var item in urls){urls[item](data);delete urls[item];var count=0;for(var i in urls){count++}return(count==0)?$.isFunction(finaly)?finaly(data):null:$.chainclude.load(urls,onload)}};$.chainclude.load(urls,onload)};$.chainclude.load=function(urls,onload){if(typeof urls=="object"&&typeof urls.length=="undefined"){for(var item in urls){return $.include.load(item,onload,urls[item].callback)}}urls=$.makeArray(urls);$.include.load(urls[0],onload,null)};$.include=function(urls,finaly){var luid=$.include.luid++;var onload=function(callback,data){if($.isFunction(callback)){callback(data)}if(--$.include.counter[luid]==0&&$.isFunction(finaly)){finaly()}};if(typeof urls=="object"&&typeof urls.length=="undefined"){$.include.counter[luid]=0;for(var item in urls){$.include.counter[luid]++}return $.each(urls,function(url,callback){$.include.load(url,onload,callback)})}urls=$.makeArray(urls);$.include.counter[luid]=urls.length;$.each(urls,function(){$.include.load(this,onload,null)})};$.extend($.include,{luid:0,counter:[],load:function(url,onload,callback){if($.include.exist(url)){return onload(callback)}if(/.css$/.test(url)){$.include.loadCSS(url,onload,callback)}else{if(/.js$/.test(url)){$.include.loadJS(url,onload,callback)}else{$.get(url,function(data){onload(callback,data)})}}},loadCSS:function(url,onload,callback){var css=document.createElement("link");css.setAttribute("type","text/css");css.setAttribute("rel","stylesheet");css.setAttribute("href",url);$("head").get(0).appendChild(css);$.browser.msie?$.include.IEonload(css,onload,callback):onload(callback)},loadJS:function(url,onload,callback){var js=document.createElement("script");js.setAttribute("type","text/javascript");js.setAttribute("src",url);$.browser.msie?$.include.IEonload(js,onload,callback):js.onload=function(){onload(callback)};$("head").get(0).appendChild(js)},IEonload:function(elm,onload,callback){elm.onreadystatechange=function(){if(this.readyState=="loaded"||this.readyState=="complete"){onload(callback)}}},exist:function(url){var fresh=false;$("head script").each(function(){if(/.css$/.test(url)&&this.href==url){return fresh=true}else{if(/.js$/.test(url)&&this.src==url){return fresh=true}}});return fresh}})})(jQuery);
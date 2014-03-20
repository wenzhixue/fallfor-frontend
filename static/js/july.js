
$(".table-striped").stacktable({id: "rwd-table"});
var my_loading = { 
        theme: false,
        baseZ: 2000,
        css: { 
            border: 'none', 
            padding: '15px', 
            backgroundColor: '#000', 
            '-webkit-border-radius': '10px', 
            '-moz-border-radius': '10px', 
            opacity: .5, 
            color: '#fff',
            'z-index': 2000,
            
            
        } 
      }
$.ajaxSetup({ 
 beforeSend: function(xhr, settings) {
   function getCookie(name) {
     var cookieValue = null;
     if (document.cookie && document.cookie != '') {
       var cookies = document.cookie.split(';');
       for (var i = 0; i < cookies.length; i++) {
         var cookie = jQuery.trim(cookies[i]);
                     // Does this cookie string begin with the name we want?
                     if (cookie.substring(0, name.length + 1) == (name + '=')) {
                       cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                       break;
                     }
                   }
                 }
                 return cookieValue;
               }
               if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
             // Only send the token to relative URLs i.e. locally.
             xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
           }
         } 
       });


function shopping_steps(this_step){
  if(this_step=='shipping'){
    $('#shopping-step-shipping').addClass('step-ongoing')
    $('#shopping-step-payment').addClass('step-next')
    $('#shopping-step-confirm').addClass('step-next')
  }else if(this_step=='payment'){
    $('#shopping-step-shipping').addClass('step-done')
    $('#shopping-step-payment').addClass('step-ongoing')
    $('#shopping-step-confirm').addClass('step-next')
  }else if(this_step=='confirm'){
    $('#shopping-step-shipping').addClass('step-done')
    $('#shopping-step-payment').addClass('step-done')
    $('#shopping-step-confirm').addClass('step-ongoing')
  }

}
$("#cart-link").popoverx({
  fire_on : 'hover',
  hover_delay_close: 3000,
  placement:'bottom',
  ensure_visiable: false,
  delay:0, html:true, 
  content: function(e){return $('#cart-popover').html()},
})

var category_list = {
  1:[
     {'id':15,'name':'Rings','slug':'rings'},
     {'id':16,'name':'Necklaces','slug':'necklaces'},
     {'id':17,'name':'Earrings','slug':'earrings'},
     {'id':18,'name':'Bracelets','slug':'bracelets'}
    ],
  5:[
     {'id':8,'name':'Bags & Wallets','slug':'men-bags-wallets'},
     {'id':10,'name':'Bottoms','slug':'men-bottoms'},
     {'id':9,'name':'Coats & Jackets','slug':'men-coats-jackets'},
     {'id':19,'name':'Shirts & Tees','slug':'man-shirts-tees'},
     {'id':20,'name':'Accessories','slug':'men-accessories'},
     
    ],
  4:[
     {'id':7,'name':'Accessories','slug':'women-accessories'},
     {'id':11,'name':'Bags & Purses','slug':'women-bags-purses'},
     {'id':12,'name':'Bottoms','slug':'women-bottoms'},
     {'id':13,'name':'Dresses','slug':'women-dresses'},
     {'id':6,'name':'Tops','slug':'women-dresses-tops'},
    ]
}

$(".top-category > li > a").popoverx({
  fire_on : 'hover',
  hover_delay_close: 3000,
  placement:'bottom',
  ensure_visiable: false,
  delay:0, html:true, 
  content: function(e){
    var id = $(this).data('id')
    if(!id){return}
    if(!category_list[id]){return}
    html= "<div><ul class='nav nav-list nav-list-vivid'>";
    $.each(category_list[id],function(key, value){
      html += "<li><a href='/browse/"+value.slug+"/'>"+value.name+"</a></li>"
    })
    html += "</ul></div>"
    return html
    //return $('#top-category-popover').html()
  },
})

function refresh_cart_item_count(){
  $.ajax({
    url: "/shopping/get-cart-items/",
    type: "get",
    data:  {},
    success: function(response){
      data = jQuery.parseJSON(response);
      if(data.cart_count == 0 ){
        $('#shopping-cart-area').hide();
        $('#empty-cart').show();
        $('#cart-item-count').text(data.cart_count);
        $('#cart-item-count').hide();

      }
      else if(data.cart_count > 0)
      {
        $('#cart-popover-items').empty()
        $.each(data.items,function(key,value){
            $('#cart-popover-items').prepend("<tr><td><img src='"+value.product__default_image__url+"' style='width:40px;height:40px'/></td><td><p style='margin:0px'>"+value.product__name+"</p><p>Quantity:"+value.quantity+"</p></td><td>$"+value.product__unit_price+"</td></tr>")    
        })
        $('#cart-popover-items').append("<tr><td colspan=2>Order sub total:</td><td>$"+data.subtotal+"</td>")
        $('#cart-item-count').text(data.cart_count);
        $('#cart-item-count').show();
        $('#no-item-cart').hide();
        if(parseInt(data.subtotal) > 29 ){
          $('#is-free-shipping').show();
          $('#no-free-shipping').hide();
        }else{
          $('#is-free-shipping').hide();
          $('#no-free-shipping').show();
        }
        $("#cart-link").trigger('mouseenter');

      }
    },
    error:function(){}
  });

}
function updateCartItem(id,qty,success){
  $.ajax({
    url: "/shop/cart/item/"+id,
    type: "post",
    data:  {
      'id': id,
      'item_quantity' :qty
    },
    success: success,
    error:function(){}
  });

}
// Some general UI pack related JS
// Extend JS String with repeat method
String.prototype.repeat = function(num) {
  return new Array(num + 1).join(this);
};

function updateSubTotalArea(subtotal,shipping)
{
  $("#cart-subtotal-area").text('$'+subtotal);
  var total;
  if(subtotal == 0 )
  { 
    shipping=0
    total = 0
  }else{
    total = parseFloat(subtotal)+parseFloat(shipping)
  }

  $("#cart-shipping-area").text('$'+shipping);
  $("#cart-total-area").text('$'+Number((total).toFixed(2)))

}



$.widget( "ui.customspinner", $.ui.spinner, {
  widgetEventPrefix: $.ui.spinner.prototype.widgetEventPrefix,
  _buttonHtml: function() { // Remove arrows on the buttons
    return "" +
    "<a class='ui-spinner-button spinner-button-color ui-spinner-up ui-corner-tr'>" +
    "<span class='ui-icon " + this.options.icons.up + "'></span>" +
    "</a>" +
    "<a class='ui-spinner-button spinner-button-color ui-spinner-down ui-corner-br'>" +
    "<span class='ui-icon " + this.options.icons.down + "'></span>" +
    "</a>";
  }
});

$('.qty-spinner').customspinner({
  min: 1,
  max: 99
}).on('focus', function () {
  $(this).closest('.ui-spinner').addClass('focus');
}).on('blur', function () {
  $(this).closest('.ui-spinner').removeClass('focus');
});

/* cart page ajax update */
$('.cart-spinner').on( "spin", function( event, ui ) {
  $.blockUI(my_loading)
  var cartItemId = $(this).data('id');
  var qty = ui.value;
  updateCartItem(cartItemId,qty,function(response){
    data = jQuery.parseJSON(response);
    //updateSubTotalArea(data.subtotal,data.shipping)
    window.location.reload();
  });
});

$('.cart-item-delete').click(function(e){
  var cart_item_id = $(this).parents('tr').attr('id'); 
  $.blockUI(my_loading)       
  $.ajax({
    url: "/shop/cart/item/"+cart_item_id+"/delete",
    type: "post",
    data:  {
      'id': cart_item_id
    },
    success: function(response){
      data = jQuery.parseJSON(response);
      if(data.success){
        window.location.reload();
        //$('#'+cart_item_id).remove();
        //refresh_cart_item_count();
        //updateSubTotalArea(data.subtotal,data.shipping)
      }
    },
    error:function(){}
  });
});

$('.order-cancel').click(function(e){
    var self = this
    bootbox.confirm("Are you sure you want to cancel this order?", function(result) {
      if(result){
        var order_id = $(self).data('orderid');
        if(! order_id )
            return
        $.ajax({
            url: "/shopping/cancel-order/",
            type: "post",
            data:  {
                'order_id': order_id,
            },
            success: function(response){
                data = jQuery.parseJSON(response);
                if(data.success){
                    $('#order-'+order_id).remove();
                }else{
                    alert(data.msg);
                }
            },
            error:function(){}
        });
    }
}); 
});


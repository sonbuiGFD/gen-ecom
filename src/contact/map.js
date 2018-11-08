(function($, window) {
  var pluginName = 'map';

  function uniqueBy(arr, fn) {
    var unique = {};
    var distinct = [];
    arr.forEach(function(x) {
      var key = fn(x);
      if (!unique[key]) {
        distinct.push(x);
        unique[key] = true;
      }
    });
    return distinct;
  }

  function toggleBounce(marker, markers) {
    $(markers).each(function(i, marker2) {
      if (marker['__gm_id'] != marker2['__gm_id']) {
        marker2.setAnimation(null);
      }
    });
    if (marker.getAnimation() != null) {
      marker.setAnimation(null);
    } else {
      marker.setAnimation(google.maps.Animation.BOUNCE);
    }
  }

  var latInit = 16.80299561823568;
  var lngInit = 107.08573669062503;
  var zoomInit = 6;
  var zoom = 12;
  var iconUrl =
    'https://www.aviva.com.vn/Data/Sites/1/media/default/map-icon.png';

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend(
      {},
      $.fn[pluginName].defaults,
      this.element.data(),
      options,
    );

    this.stores = [];
    this.markers = {};
    this.selectedProvince = '';
    this.selectedDistrict = '';
    this.map = this.element.find('#map_canvas');
    this.provincesOptions = this.element.find('#provinces');
    this.districtsOptions = this.element.find('#districts');
    this.listStore = this.element.find('#listStore');

    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var that = this;
      // set map options
      var center = this.getCurrentLocation();
      var mapOptions = {
        zoom: zoomInit,
        center,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
      };

      // display map
      this.mapView = new google.maps.Map(
        document.getElementById('map_canvas'),
        mapOptions,
      );
      this.getStores();

      // bind event change province
      this.provincesOptions.on('change', function() {
        that.selectedProvince = $(this).val();
        if ($(this).val() === '') {
          this.selectedDistrict = '';
        }
        that.renderDistrictsOptions();
        that.renderListStore();
      });
      // bind event change District
      this.districtsOptions.on('change', function() {
        that.selectedDistrict = $(this).val();
        that.renderListStore();
      });

      // bind event click store
      this.listStore.on('click', 'li', function() {
        var id = $(this).data('id');
        var marker = that.markers[id];
        that.mapView.panTo(marker.getPosition());
        google.maps.event.trigger(marker, 'click');
      });
    },

    getCurrentLocation: function() {
      var that = this;
      var pos = {
        lat: latInit,
        lng: lngInit,
      };
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          function(position) {
            pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            that.mapView.setCenter(pos);
            that.mapView.setZoom(zoom);
          },
          function(err) {
            console.log('getCurrentPosition', err);
          },
        );
      }
      return pos;
    },

    getStores: function() {
      var that = this;
      var url = 'https://fantasy.steenify.com/wp-json/wp/v2/posts?tags=52';
      $.get(url, function(data) {
        that.stores = data;
        that.renderMapStore();
        that.renderProvincesOptions();
        that.renderDistrictsOptions();
        that.renderListStore();
      });
    },

    renderMapStore: function() {
      var infoWindow = new google.maps.InfoWindow();
      var that = this;
      var marker;
      $.each(that.stores, function(i, store) {
        var data = store.metadata;
        marker = new google.maps.Marker({
          position: new google.maps.LatLng(
            parseFloat(data.lat[0]),
            parseFloat(data.lng[0]),
          ),
          title: data.name[0],
          icon: iconUrl,
          map: that.mapView,
        });

        that.markers[store.id] = marker;

        google.maps.event.addListener(
          marker,
          'click',
          (function(marker) {
            return function() {
              infoWindow.setContent(
                `<h3 class="color-main" style='text-align: center;margin: 0;'>
                  ${data.name[0]}
                  </h3>
                  <p>địa chỉ: ${data.address[0]}</p>`,
              );
              infoWindow.open(that.mapView, marker);
              toggleBounce(marker, that.markers);
            };
          })(marker),
        );
      });
    },

    renderProvincesOptions: function() {
      var that = this;
      var options = '<option value="">Chọn Tỉnh / Thành Phố</option>';
      const uniqueProvince = uniqueBy(that.stores, function(store) {
        return store.metadata.province_code[0];
      });
      uniqueProvince.forEach(item => {
        options += `<option value="${item.metadata.province_code[0]}">${
          item.metadata.province[0]
        }</option>`;
      });
      this.provincesOptions.html(options);
    },

    renderDistrictsOptions: function() {
      var that = this;
      var options = '<option value="">Chọn Quận / Huyện</option>';
      // selected Province
      if (that.selectedProvince && that.selectedProvince !== '') {
        var filteredProvince = this.stores.filter(function(store) {
          return store.metadata.province_code[0] === that.selectedProvince;
        });

        const uniqueDistrict = uniqueBy(filteredProvince, function(store) {
          return store.metadata.district_code[0];
        });

        uniqueDistrict.forEach(item => {
          options += `<option value="${item.metadata.district_code[0]}">${
            item.metadata.district[0]
          }</option>`;
        });
      }
      this.districtsOptions.html(options);
    },

    renderListStore: function() {
      var that = this;
      var list = that.stores;
      var res = '';
      // filter provinces
      if (this.selectedProvince && this.selectedProvince !== '') {
        list = list.filter(function(store) {
          return store.metadata.province_code[0] === that.selectedProvince;
        });
      }

      // filter provinces
      if (this.selectedDistrict && this.selectedDistrict !== '') {
        list = list.filter(function(store) {
          return store.metadata.district_code[0] === that.selectedDistrict;
        });
      }
      list.forEach(function(store) {
        var data = store.metadata;
        res += `
        <li class="list_store_item" data-id="${store.id}">
            <h4>${data.name[0]}</h4>
          <div>
            <strong><img src="./assets/img/contact_map_location.svg"/></strong> <span>${
              data.address[0]
            }</span>
          </div>
          <div>
            <strong><img src="./assets/img/contact_map_phone.svg"/></strong> <span>${
              data.phone[0]
            }</span>
          </div>
          <div>
            <strong><img src="./assets/img/contact_map_email.svg"/></strong> <span>${
              data.email[0]
            }</span>
          </div>
         </li>
        `;
      });
      this.listStore.html(res);
    },

    destroy: function() {
      $.removeData(this.element[0], pluginName);
    },
  };

  $.fn[pluginName] = function(options, params) {
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (!instance) {
        $.data(this, pluginName, new Plugin(this, options));
      } else if (instance[options]) {
        instance[options](params);
      }
    });
  };

  $.fn[pluginName].defaults = {};

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });
})(jQuery, window);

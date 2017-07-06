/*globals $, SimpleStorage, document*/

var addToLog = function(id, txt) {
  $(id + " .logs").append("<br>" + txt);
};

// Blockchain example
$(document).ready(function() {

  $("#blockchain button.set").click(function() {
    var value = parseInt($("#blockchain input.text").val(), 10);
    SimpleStorage.set(value);
    addToLog("#blockchain", "SimpleStorage.set(" + value + ")");
  });

  $("#blockchain button.get").click(function() {
    SimpleStorage.get().then(function(value) {
      $("#blockchain .value").html(value.toNumber());
    });
    addToLog("#blockchain", "SimpleStorage.get()");
  });

});

//this how we store the references in blockchain
//EmbarkJS.Storage.saveText('some long text').then(function(hash) { yourContract.saveRef(hash); })


// Storage (IPFS) example
$(document).ready(function() {
  // automatic set if config/storage.json has "enabled": true and "provider": "ipfs"
  EmbarkJS.Storage.setProvider('ipfs',{server: 'localhost', port: '5001'});

  $("#storage .error").hide();
  EmbarkJS.Storage.setProvider('ipfs')
    .then(function(){
      console.log('Provider set to IPFS');
      EmbarkJS.Storage.ipfsConnection.ping()
        .then(function(){
            $("#status-storage").addClass('status-online');
            $("#storage-controls").show();
        })
        .catch(function(err) {
          if(err){
            console.log("IPFS Connection Error => " + err.message);
            $("#storage .error").show();
            $("#status-storage").addClass('status-offline');
            $("#storage-controls").hide();
          }
        });
    })
    .catch(function(err){
      console.log('Failed to set IPFS as Provider:', err.message);
      $("#storage .error").show();
      $("#status-storage").addClass('status-offline');
      $("#storage-controls").hide();
    });

  //function that genarates key
  function getKey(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 10; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  $("#storage button.setIpfsText").click(function() {
    var value = $("#storage input.ipfsText").val();
    EmbarkJS.Storage.saveText(value).then(function(hash) {
      var key = getKey();
      addToLog(hash,key);
      Data.set(key,hash);
      $("span.textHash").html(key);
      $("input.textHash").val(key);
      //store it in the blockchain
      addToLog("#storage", "EmbarkJS.Storage.saveText('" + hash + "').then(function(hash) { })");
    })
    .catch(function(err) {
      if(err){
        console.log("IPFS saveText Error => " + err.message);
      }
    });
  });

  $("#storage button.loadIpfsHash").click(function() {
    var value = $("#storage input.textHash").val();
    /*SimpleStorage.get().then(function(value) {
      console.log(value.toNumber());
      //$("#blockchain .value").html(value.toNumber());
      });*/
      
    EmbarkJS.Storage.get(value).then(function(content) {
      $("span.ipfsText").html(content);
      //get the reference from blockchain
      addToLog("#storage", "EmbarkJS.Storage.get('" + value + "').then(function(content) { })");
    })
    .catch(function(err) {
      if(err){
        console.log("IPFS get Error => " + err.message);
      }
    });
  });

  $("#storage button.uploadFile").click(function() {
    var input = $("#storage input[type=file]");
    EmbarkJS.Storage.uploadFile(input).then(function(hash) {
      $("span.fileIpfsHash").html(hash);
      $("input.fileIpfsHash").val(hash);
      addToLog("#storage", "EmbarkJS.Storage.uploadFile($('input[type=file]')).then(function(hash) { })");
    })
    .catch(function(err) {
      if(err){
        console.log("IPFS uploadFile Error => " + err.message);
      }
    });
  });

  $("#storage button.loadIpfsFile").click(function() {
    var hash = $("#storage input.fileIpfsHash").val();
    var url = EmbarkJS.Storage.getUrl(hash);
    var link = '<a href="' + url + '" target="_blank">' + url + '</a>';
    $("span.ipfsFileUrl").html(link);
    $(".ipfsImage").attr('src', url);
    addToLog("#storage", "EmbarkJS.Storage.getUrl('" + hash + "')");
  });

});

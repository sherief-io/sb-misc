changeAssetsModelCategory();
removeModelCatFromProdModel();

// 1. Get assets that have model Category as Wirless Lan Controller
//     and Change the model Category to "IP Switch"
function changeAssetsModelCategory() {
  var targetAssetGR = new GlideRecord("alm_hardware");
  targetAssetGR.addEncodedQuery(
    "model_category=33cd77b51b14e0102952b91bcd4bcba9"
  );
  targetAssetGR.query();
  while (targetAssetGR.next()) {
    targetAssetGR.setValue(
      "model_category",
      "bceb7454c3031000b959fd251eba8f42"
    );
    targetAssetGR.update();
  }
}

// 2. Change the Product Models remove Model Category
function removeModelCatFromProdModel() {
  var modelGR = new GlideRecord("cmdb_hardware_product_model");
  modelGR.addEncodedQuery(
    "cmdb_model_category=33cd77b51b14e0102952b91bcd4bcba9"
  );
  modelGR.query();
  while (modelGR.next()) {
    var currentModels = modelGR.getValue("cmdb_model_category").split(",");
    var newModelsArray = [];
    for (var i = 0; i < currentModels.length; i++) {
      if (currentModels[i] != "33cd77b51b14e0102952b91bcd4bcba9") {
        newModelsArray.push(currentModels[i]);
      }
    }
    modelGR.setValue("cmdb_model_category", newModelsArray);
    modelGR.update();
  }
}

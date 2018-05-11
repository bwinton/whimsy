/* global ExtensionAPI:false */

const { classes: Cc, interfaces: Ci, utils: Cu } = Components;

this.whimsyExp = class API extends ExtensionAPI {
  getAPI(context) {
    return {
      whimsyExp: {
        setNewtabOverride: async (shouldOverride) => {      
          let aboutNewTabService = Cc["@mozilla.org/browser/aboutnewtab-service;1"]
                                   .getService(Ci.nsIAboutNewTabService);
          let {extension} = this;
          let {manifest} = extension;
          let url = extension.baseURI.resolve(manifest.chrome_url_overrides.newtab);

          if (shouldOverride) {
            aboutNewTabService.newTabURL = url;
          } else {
            aboutNewTabService.newTabURL = "about:newtab";
          }
        }
      }
    };
  }
};

import { environment } from '../../environments/environment';

export var url = environment.apiPath;
export var imageUrl = environment.imageApiPath;
export var pixibayKey = environment.imageApiKey;
export var methods = {
    getpolarities: "/getpolarities",
    getcensusdata: "/getcensusdata",
    getdensitymaps: "/getdensitymaps",
    getImage: ""
}
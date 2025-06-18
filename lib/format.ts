// Format the json into the correct format

// {
//     "ResponseData": "PzuBqQ1h/v/b8enCSSxQUaeNghWVd9XColHALlYSHzE3A5tc5X1wL8fdKsCbezBGMYslZQbFPSshm9xypvphjYv1mSZDha1b5EWWvs06JPxm/165PmWs8avRBi3HQ8OMlZnPA1xYeYWDgxefeVBi13xzHQfQDZN63LlYi4t/U9ESWOKnEaQqjY9WXqBs7A51JuN7j4dFettzzcTWhJdUfN44/+f6GroQLqxaIjxSEUSK4K9BybzBD+Cl4xlsYfhzMK4LtNkOvcjEXV8qsTW0Af1aMOPS/XS+LD8NGh2/Up2PjmSy0fylGpvg2YsXnRKz"
// }

export type payload={
    ResponseData: string;
}

export function jsonToString(json:payload):string{
    return json.ResponseData;
}




    
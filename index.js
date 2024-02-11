const formState = {
    date_inval:false,
    cardNum_inval:false,
    blank:false,
    cvc_invalid: false
}
var first_load = false;
var styles = {}

var card_outputs = {}
var submission = false;


// on content load , grab the relevant elements
document.addEventListener("DOMContentLoaded", (e)=>{
    var form = document.querySelector(".card__form")
    let parents = document.querySelectorAll(".parent");
    console.log(parents)

    // slots to be update in realtime
    let card_name = document.querySelector(".card__details-name_name");
    let card_number = document.querySelector(".card__details-number") ;
    let card_month = document.querySelector(".mm");
    let card_year = document.querySelector(".yy");
    let card_cvc = document.querySelector(".card__details-cvc")

    let card_slots = [card_name, card_number, card_month, card_year, card_cvc]
    // getting initial styling for the inputs
    if(first_load==false){
        for(let i=0; i<form.getElementsByTagName("input").length;i++){
            let style = form.getElementsByTagName("input")[i].style
            let name = form.getElementsByTagName("input")[i].name
            styles[`${name}`] = style;
            card_outputs[`${name}`]='';

        }
        first_load = true;
    }
    console.log(card_outputs)

    for(let i=0;i<form.getElementsByTagName("input").length;i++){
        let input = form.getElementsByTagName("input")[i];
        input.addEventListener("keyup", (e)=>{
            updateRealTime(input, card_slots[i])
        })
     
    }

   


    form.addEventListener("submit", (e)=>{
        e.preventDefault();
        checkBlank(parents)
        checkCardNum(parents[1])
        checkDate(parents[2])
        checkCvc(parents[3])
        if(checkForm(form)){
            console.log("submitted")
            if(!submission){
                handleComplete(form);
                submission = true;
            }
        }else{
            console.log("not submitted")
        }
        
    })
   
})






// reusable functions


// updates the card details in realtime
function updateRealTime(input, output){
        output.innerHTML = input.value;

}


// checking blanks
function checkBlank(parents){
    parents.forEach((parent)=>{
        let small = Array.from(parent.children)[2]
        // checking if its the input group
        if(parent.classList.contains("card__expiry")){
            let input_group = Array.from(parent.children)[1];
            for( input of input_group.children){
                if(input.value==""){
                        input.style = "border:1px solid red;"
                        small.innerHTML = "can't be blank"
                        formState.blank = true;
                }else{
                    input.style = styles[`${input.name}`]
                    small.innerHTML = "";
                }
            }
        }else{
            let input = Array.from(parent.children)[1];
            
            if(input.value==""){
                small.innerHTML = "can't be blank"
                input.style = "border:1px solid red";
                formState.blank = true;
            }else{
                input.style = styles[`${input.name}`];
                small.innerHTML = ""
            }
        }
    })
    
}

// checking card number

function checkCardNum(parent){
    let small = Array.from(parent.children)[2]
    let input = Array.from(parent.children)[1];
    let error_msg= "";

    // cheking if the card number is not of length 8
    if(input.value.length != 8){
        error_msg = "Wrong format, should be 8 digits long"

         // check if there is a previous error

       
         small.innerHTML = error_msg
         input.style = "border:1px solid red";
         formState.cardNum_inval = true;
        
    }else{
        // check if the card number contains a letter
        let hasNumber = /^\d+$/; 
        if(!hasNumber.test(input.value)){
            error_msg = "Wrong format, numbers only"
            small.innerHTML = error_msg;
            input.style = "border:1px solid red";
            formState.cardNum_inval = true;

        }else{
            input.style = styles[`${input.name}`];
            small.innerHTML = "";
            formState.cardNum_inval = false;
        }

    }

   
}

// checking date
function checkDate(parent){
    let small = Array.from(parent.children)[2];
    let input_group = Array.from(parent.children)[1];
    let month = Array.from(input_group.children)[0];
    let year = Array.from(input_group.children)[1];
    let date = new Date(`20${year.value}-${month.value}`);

    // checking if its a valid date
    if((date instanceof Date && !isNaN(date))){
        console.log(!isNaN(date))
        small.innerHTML = ""
        month.style = styles[`${month.name}`]
        year.style = styles[`${year.name}`]
        formState.date_inval = false;
    }else{
        small.innerHTML = "Invalid date";
        month.style = "border:1px solid red";
        year.style = "border:1px solid red";
        formState.date_inval= true;
    }

}

// checking cvc
function checkCvc(parent){
    let small = Array.from(parent.children)[2];
    let input = Array.from(parent.children)[1];
    

    // checking if cvc is equal to length of 3
    if(input.value.length != 3){
        small.innerHTML = "Wrong format, should be 3 digits long";
        input.style = "border:1px solid red";
        formState.cvc_invalid = true;

    }else{
        // checking if its only numbers
        let hasNumber = /^\d+$/; 
        if(!hasNumber.test(input.value)){
            small.innerHTML =  "Wrong format, numbers only";
            input.style = "border:1px solid red";
            formState.cvc_invalid = true;

        }else{
            input.style = styles[`${input.name}`];
            small.innerHTML = "";
            formState.cvc_invalid = false;
        }
    }

}

// checks form for any error
function checkForm(form){
    let atleastone = false;
    // checking if there's any empty input
    for(let i=0; i < form.getElementsByTagName("input").length;i++){
        
        if( form.getElementsByTagName("input")[i].value==""){
                 atleastone=true;
                 break;
        }
    }

    if(atleastone){
        formState.blank = true;

    }else{
        formState.blank = false;
    }

    // checking if theres any error
    if(formState.blank || formState.cardNum_inval ||formState.cvc_invalid
        ||formState.date_inval){
            return false
        }else{
            return true
        }

}

// 
function handleComplete(form){
  
    let parents = document.querySelectorAll(".parent");
    for(parent of parents){
        parent.classList.add("hidden");
    }

    let img_div = document.createElement("div")
    let img = document.createElement("img")
    img.style = 'margin:0 auto;'
    img_div.appendChild(img);
    img.src = "images/icon-complete.svg"
    let h1 = document.createElement("h1");
    h1.innerHTML = "Thank you!";
    h1.style = "text-transform:uppercase; text-align:center;"
    let p = document.createElement("p")
    p.innerHTML = "We've added your card details"
    p.style = "color:hsl(279, 6%, 55%); text-align:center;"
    submit = Array.from(form.children)[3]
    submit.value = "Continue";
    submit.addEventListener("click", (e)=>{
        location.reload()
    })
    form.removeChild(submit)
    form.appendChild(img_div)
    form.appendChild(h1)
    form.appendChild(p)
    form.appendChild(submit)
    


}




// // function that handles sumbission
// function handleSubmite(e){
//     e.preventDefault();
//     checkBlank(parents)
//     checkCardNum(parents[1])
//     checkDate(parents[2])
//     checkCvc(parents[3])
    
// }
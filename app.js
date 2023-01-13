const clearBtn = document.querySelector(".clear");
const toDoList = document.querySelector("#list");
const toDoInput = document.querySelector("#input");
const toDoAddBtn = document.querySelector(".fa-plus-circle");

const checkBtn = "fa-check-circle";
const uncheckBtn = "fa-circle-thin";
const textLineThrough = "line-through";


let toDoContainer, id; //let allows the variables to be changed dynamically

let toDoData = localStorage.getItem("to-do-item");

if(toDoData){ //check if there is something inside the local storage
    toDoContainer = JSON.parse(toDoData);
    id = toDoContainer.length;
    loadToDoContainer(toDoContainer); //if there is something inside the local storage -> load it
} else {
    toDoContainer = [];
    id = 0; //reset the page 
}


/**
 * This function is used to store the data in the local storage and keep the values even after refreshing the page/closing the browser
 * @param {array} array - stores the values that compose a to do elemnt in an array
 */

function loadToDoContainer(array){
   array.forEach(function(item) {
       //retrieve from the local storage
        addToDo(item.name, item.id, item.done, item.trash);
    });
}

//clear local storage
clearBtn.addEventListener("click", function(){
    localStorage.clear();
    location.reload();
});


/**
 * This is a function to dynamically add the elements to the list and mark them as done/deleted
 * 
 * @param {string} toDo - dynamically generates a to-do item
 * @param {number} id  - adds an id to track and arrange the added items in the local storage
 * @param {boolean} done - checks the status of the to do item
 * @param {boolean} trash - checks if the item was deleted form the list 
 * @returns - remove the entire element if the trash value is true and doesn't run the code
 * 
 * beforeend - add the item inside the element, after its last child, when the enter key is pressed/or the plus button clicked
 */

function addToDo(toDo, id, done, trash) {
   
   if(trash) return;

   const toDoDone =  done ? checkBtn : uncheckBtn; //if done is true ->  check the button
   const toDoLine =  done ? textLineThrough : ""; //if done is true -> add a line through the item to cut it from the list

   const item = `
                <li class = "item">
                    <i class = "fa ${toDoDone} complete" status = "complete" id = "${id}"></i>
                    <p class = "text ${toDoLine}">${toDo}</p>
                    <i class = "fa fa-trash-o delete" status = "delete" id = "${id}"></i>
                </li>
                `;

   const toDoItemPosition = "beforeend"; 
   toDoList.insertAdjacentHTML(toDoItemPosition, item); 

}

document.addEventListener("keyup", displayToDo);

toDoAddBtn.addEventListener("click", displayToDo);


/**
 * This functions controls the flow of the document and targets only when the user clicks on the aformentioned events (add, trash)
 * it prevents from doing actions just when the user would clikc randomly on the page
 * @param {event} e 
 */

function displayToDo(e) {
    if(e.keyCode === 13 || e.target.classList.value === 'fa fa-plus-circle')
    { 
        const toDo = input.value;
        if(toDo){ //check if the input field is not empty
            addToDo(toDo, id, false, false);
            toDoContainer.push({
                //set predefined values to object in the  array
                name: toDo,
                id: id,
                done: false, 
                trash: false
            });

            //update the local storage
            localStorage.setItem("to-do-item", JSON.stringify(toDoContainer));


            id++;
        }
        input.value = " ";
    }

}


/**
 *  this function marks the item complete 
 * when a to do is completed -> the user clicks on the circle icon
 * @param {array} toDoItem 
 */
function completeToDo(toDoItem){
    toDoItem.classList.toggle(checkBtn);
    toDoItem.classList.toggle(uncheckBtn);
    toDoItem.parentNode.querySelector('.text').classList.toggle(textLineThrough);

    toDoContainer[toDoItem.id].done = toDoContainer[toDoItem.id].done
     ? false
     : true; //if the item is done -> return true; if the item is not done -> return false
}

//when a to do is removed -> the item is deleted
function removeToDo(toDoItem){
    toDoItem.parentNode.parentNode.removeChild(toDoItem.parentNode);
    toDoContainer[toDoItem.id.trash] = true;
}


//target the dynamic generated to do items

toDoList.addEventListener('click', function(e) {

    if( //restrict the clicking to only the specified elements and remove errors
        e.path[0].localName === 'p' || 
        e.path[0].localName === 'li' ||
        e.path[0].localName === 'u;'
        ) 
        return; 

    const toDoItem = e.target;
    const toDoStatus = toDoItem.attributes.status.value; //only targets the items who have both a status and a value

    if(toDoStatus === "complete"){
        completeToDo(toDoItem)
    } else if (toDoStatus === "delete"){
        removeToDo(toDoItem);
    }
    localStorage.setItem("to-do-item", JSON.stringify(toDoContainer));

});

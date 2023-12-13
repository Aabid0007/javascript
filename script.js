function btn_filled() {
    const btn_filled = document.getElementsByClassName("add_employee")[0];
    btn_filled.style.display = "block";
    const overlay = document.getElementsByClassName("overlay")[0];

    overlay.style.display = "block";
}
// add_employee_close_btn
function close_btn() {
    var close_btn = document.getElementsByClassName("add_employee")[0];
    close_btn.style.display = "none";
    const overlay = document.getElementsByClassName("overlay")[0];
    overlay.style.display = "none";
    clearForm();
    get_emp();
    clearErrorMessages();
}


         


// get
// ..............................fetch-data.................................-start
get_emp();
function get_emp() {
    
    fetch("http://localhost:3000/employees")
        .then(Response => {
            return Response.json();
        })
        .then(data => {
            employeeData = data;

            let temp = '';
            // -------- list-select-----start

            const list_employee = document.getElementById('list_employee');
            
            list_employee.addEventListener("click", get_emp);
            const TotalCountOnPage = list_employee.value;
            
            // -------- list-select-----end
            const total_employee = document.getElementById("total_employee");
            total_employee.innerHTML = `of ${employeeData.length}`

            const totalPages = Math.ceil(data.length / TotalCountOnPage);
            pagination(totalPages);
            const start = TotalCountOnPage * (CurrentPage - 1);

            const end = Math.min(TotalCountOnPage * CurrentPage, data.length);
            for (var i = start; i < end; i++) {
                const employee = data[i];


                temp += `<tr id="selectNow">
        <td>#0${i + 1}</td>
        <td><div class="employee_img"><img class="img_table" src='http://localhost:3000/employees/${employee.id}/avatar'>${employee.salutation + " " + employee.firstName + " " + employee.lastName}
        </div></td>
        <td>${employee.email}</td>
        <td>${employee.phone}</td>
        <td>${employee.gender}</td>
        <td>${employee.dob}</td>
        <td class="col_section">${employee.country}</td>
        <td><div class="menu_icon"><button class="three_dot_list"
        onclick="three_dot_list('${employee.id}')"><i class="fa-solid fa-ellipsis"></i></button></div></td>
        <div class="employee_action_btn" ></div>
        <div id="noEmployeeMessage" style="display: none;">No employees found</div>

    </tr>`

            }
            document.getElementById('table_text').innerHTML = temp;

        });
}
// ..............................fetch-data.................................-end


// ...................................pagination...............................-start
var CurrentPage = 1;

function pagination(totalPages) {

    var pgnum = document.getElementById("Page_Num_Btns");
    let temp = '';

    for (let i = 1; i <= totalPages; i++) {
        temp += `<button id="page${i}">${i}</button>`;
    }

    pgnum.innerHTML = temp;

    pgnum.addEventListener('click', function (e) {
        if (e.target.tagName === 'BUTTON') {
            const pageNumber = parseInt(e.target.textContent);
            if (!isNaN(pageNumber)) {
                CurrentPage = pageNumber;
                get_emp();
            }
        }
    });

    var pageLeftButton = document.getElementById("pageleft");
    var pageRightButton = document.getElementById("pageright");


    if (CurrentPage === 1) {
        pageLeftButton.classList.add('hidden');
    } else {
        pageLeftButton.classList.remove('hidden');
    }

    if (CurrentPage === totalPages) {
        pageRightButton.classList.add('hidden');
    } else {
        pageRightButton.classList.remove('hidden');
    }

    pageLeftButton.addEventListener("click", function () {
        if (CurrentPage > 1) {
            CurrentPage--;
            get_emp();
            
        }
    });

    pageRightButton.addEventListener("click", function () {
        if (CurrentPage < totalPages) {
            CurrentPage++;
            get_emp();
        }
    });
    const actionButton = document.getElementById(`page${CurrentPage}`);
    actionButton.classList.add('active');
}

// ...................................pagination...............................-end





// ------------------------------  add-employee --------------------------start
const addButton = document.getElementById('add_employee');
addButton.addEventListener('click', async (e) => {
        e.preventDefault();
        const form = document.getElementById('add_employee_form');

        const isValid = validateForm();

        if (!isValid) {
            return;
        }

        const salutation = document.getElementById('Salutation').value;
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('LastName').value;
        const email = document.getElementById('Email').value;
        const phone = document.getElementById('Phone').value;
        const dob = document.getElementById('dob').value;
        const gender = document.querySelector('input[name="gender"]:checked').value;
        const qualifications = document.getElementById('Qualifications').value;
        const address = document.getElementById('Address').value;
        const country = document.getElementById('country').value;
        const state = document.getElementById('State').value;
        const city = document.getElementById('City').value;
        const pin = document.getElementById('pin').value;
        const [year, month, date] = dob.split("-");
        const newDob = `${date}-${month}-${year}`;
        const formdatas = {
            salutation,
            firstName,
            lastName,
            email,
            phone,
            dob: newDob,
            gender,
            qualifications,
            address,
            country,
            state,
            city,
            pin,
            username: firstName,
            password: phone,
        }
        const apiUrl = 'http://localhost:3000/employees';

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formdatas), // Convert data to JSON
        })
            .then(response => response.json())

            .then(data => {

                console.log('API Response:', data);

                get_emp();
                const upload_file = document.getElementById("upload_file");
                const formData = new FormData();
                formData.append("avatar", upload_file.files[0]);
                fetch(`http://localhost:3000/employees/${data.id}/avatar`, {
                    method: "POST",
                    body: formData
                })
                    .then((res) => {
                        console.log("Image uploaded:", res);
                        showPopup()

                    })
                    .catch((error) => {
                        console.error("Error uploading image:", error);
                    })

            })

            .catch(error => {
                console.error('Error:', error);
            });
        get_emp();



    }
);
// ....................add employee-end.................................... end





// ......... delete-method...............................................start

// delete_employee_open_form
function open_delete_form(id) {
    var delete_form = document.getElementsByClassName("delete_btn_form")[0];
    delete_form.style.display = "block";
    var overlay = document.getElementsByClassName("overlay")[0];
    overlay.style.display = "block";

    const delebutton = document.getElementById('delete_btn_action')
    delebutton.addEventListener('click', () => {

        delete_employee(id);
    })
}


function delete_employee(id) {
    fetch(`http://localhost:3000/employees/${id}`, {
        method: 'DELETE',
    }
    ).then(response => response.json())
        .then(data => {
            console.log('API Response:', data);
            get_emp();
            deleteshowPopup();
        })
        .catch(error => {
            console.error('Error:', error);
        });
    delete_close_btn();

}


// delete_employee_close_form
function delete_close_btn() {
    
    var close_btn = document.getElementsByClassName("delete_btn_form")[0];
    close_btn.style.display = "none";
    var overlay = document.getElementsByClassName("overlay")[0];
    overlay.style.display = "none";
}

// .........delete-method-end...............................................end




// edit employee  
// .............................edit-method................................-start


function edit_btn(id) {
    const imgView = document.getElementById("edit_img");
    imgView.src = "";
    const upload_file =document.getElementById('edit_upload_file');
    upload_file.value ="";
    const edit_btn = document.getElementsByClassName("edit_employee")[0];
    const overlay = document.getElementsByClassName("overlay")[0];
    edit_btn.style.display = "block";
    overlay.style.display = "block";



    // ...................edit_employee_data_insert...................start
    fetch(`http://localhost:3000/employees/${id}`)
        .then(Response => {
            return Response.json();
        })
        .then(data => {
            console.log(data);
            const edit_img = document.getElementById("edit_img");
            edit_img.src = `http://localhost:3000/employees/${id}/avatar`;
            document.getElementById('edit_Salutation').value = data.salutation;
            document.getElementById('edit_firstName').value = data.firstName;
            document.getElementById('edit_LastName').value = data.lastName;
            document.getElementById('edit_Email').value = data.email;
            document.getElementById('edit_Phone').value = data.phone;
            const dobValue = data.dob;
            const [day, month, year] = dobValue.split('-');
            const formattedDob = `${year}-${month}-${day}`;
            document.getElementById('edit_dob').value = formattedDob;
            document.querySelector(`input[name="edit_gender"][value ="${data.gender}"]`).checked = true;
            document.getElementById('edit_Qualifications').value = data.qualifications;
            document.getElementById('edit_Address').value = data.address;
            document.getElementById('edit_country').value = data.country;
            document.getElementById('edit_State').value = data.state;
            document.getElementById('edit_City').value = data.city;
            document.getElementById('edit_pin').value = data.pin;
            get_emp();
        })

        .catch(error => {
            console.error('error:', error);
        })

    const editBtn = document.getElementById('savechange');
    editBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        editEmployee(id);
        edit_close_btn();
        get_emp();
    });
}
// ...................edit_employee_data_insert...................-end



// edit_employee_close_btn
function edit_close_btn() {
    var close_btn = document.getElementsByClassName("edit_employee")[0];
    close_btn.style.display = "none";
    var overlay = document.getElementsByClassName("overlay")[0];
    overlay.style.display = "none";


}


function editEmployee(id) {
    get_emp();
    const salutation = document.getElementById('edit_Salutation').value;
    const firstName = document.getElementById('edit_firstName').value;
    const lastName = document.getElementById('edit_LastName').value;
    const email = document.getElementById('edit_Email').value;
    const phone = document.getElementById('edit_Phone').value;
    const dob = document.getElementById('edit_dob').value;
    const gender = document.querySelector('input[name="edit_gender"]:checked').value;
    const qualifications = document.getElementById('edit_Qualifications').value;
    const address = document.getElementById('edit_Address').value;
    const country = document.getElementById('edit_country').value;
    const state = document.getElementById('edit_State').value;
    const city = document.getElementById('edit_City').value;
    const pin = document.getElementById('edit_pin').value;
    const [year, month, date] = dob.split("-");
    const dobformatted = `${date}-${month}-${year}`;
    const updatedemployee = {
        salutation,
        firstName,
        lastName,
        email,
        phone,
        dob: dobformatted,
        gender,
        qualifications,
        address,
        country,
        state,
        city,
        pin,
        username: firstName,
        password: phone,
    };

    fetch(`http://localhost:3000/employees/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedemployee),

    })

        .then(Response => {
            return Response.json();
        })
       const edit_upload_file = document.getElementById("edit_upload_file");
       const formData = new FormData();
       formData.append("avatar", edit_upload_file.files[0]);

       fetch(`http://localhost:3000/employees/${id}/avatar`, {
        method: "POST",
        body: formData
    })

        .then(data => {
            console.log('API Response:', data);

            get_emp();
            EditedshowPopup();

        })

        .catch(error => {
            console.error('Error:', error);
        });
}
// .............................put-method................................-end




// three-dot-open-form......................start

function three_dot_list(id) {
    const three_dot_list = document.getElementsByClassName("employee_action_btn")[0];
    console.log(id);
    three_dot_list.innerHTML =
        ` 
        <a href="viewindex.html?id=${id}"><button class="employee_btn view_btn" ><i class="fa-solid fa-eye"></i>View
      Details</button></a>
  <button class="employee_btn edit_btn" onclick="edit_btn('${id}')"><i
          class="fa-solid fa-pen"></i>Edit</button>
  <button class="employee_btn delete_btn" onclick="open_delete_form('${id}')">
        <i class="fa-regular fa-trash-can"></i>Delete</button>
    `
    three_dot_list.style.display = "block";

    // three dot arrange...............................
    const moreOptionToggles = document.querySelectorAll(".three_dot_list");
    moreOptionToggles.forEach(btn => {
        btn.addEventListener("click", event => {
            const buttonRect = btn.getBoundingClientRect();
            const btnActive = document.querySelector(".employee_action_btn");
            btnActive.style.top = buttonRect.top - 70 + "px";
            btnActive.style.display = (btnActive.style.display === "none" || btnActive.style.display === "") ? "block" : "none";

            event.stopPropagation();
        });
    });
    // three-dot-open-form......................-end




    // ..............three-dot-screen_click_to_closing...............-start
    function closeMenu() {
        three_dot_list.style.display = "none";
        document.removeEventListener("mousedown", handleOutsideClick);
    }
    function handleOutsideClick(event) {
        if (!three_dot_list.contains(event.target)) {
            closeMenu();
        }
    }
    document.addEventListener("mousedown", handleOutsideClick);
}
// ..............three-dot-screen_click_to_closing...............-end





// ................................validateForm......................................-start
function validateForm() {
    const salutation = document.getElementById('Salutation').value.trim();
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('LastName').value.trim();
    const email = document.getElementById('Email').value.trim();
    const phone = document.getElementById('Phone').value.trim();
    // const dob = document.getElementById('dob').value;
    const dobInput = document.getElementById('dob');
    const dobError = document.getElementById('dobError');
    const dobValue = dobInput.value.trim();

    const selectedGender = document.querySelector('input[name="gender"]:checked');
    const genderError = document.getElementById('genderError');

    const qualifications = document.getElementById('Qualifications').value.trim();
    const address = document.getElementById('Address').value.trim();
    const country = document.getElementById('country').value.trim();
    const state = document.getElementById('State').value.trim();
    const city = document.getElementById('City').value.trim();
    const pin = document.getElementById('pin').value.trim();

    // regex validation

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const phonePattern = /^\d{10}$/;
    const namePattern = /^[A-Za-z]+$/;

    let isValid = true;


    // image_validation-----------------
    const imageInput = document.getElementById('upload_file');
    const imageError = document.getElementById('imageError');
    if (imageInput.files.length === 0) {
        imageError.textContent = 'Please select an image.';
        isValid = false;
    } else {
        imageError.textContent = "";
    }



    if (salutation === 'select') {
        document.getElementById('SalutationError').textContent = 'Invalid select';
        isValid = false;
    }


    if (!namePattern.test(firstName)) {
        document.getElementById('firstNameError').textContent = 'First Name is required';
        isValid = false;
    }


    if (!namePattern.test(lastName)) {
        document.getElementById('LastNameError').textContent = 'Last Name is required';
        isValid = false;
    }


    if (!emailPattern.test(email)) {
        document.getElementById('EmailError').textContent = 'Invalid Email';
        isValid = false;
    }

    if (!phonePattern.test(phone)) {
        document.getElementById('PhoneError').textContent = 'Invalid Phone Number';
        isValid = false;
    }


    if (dobValue === '') {
        dobError.textContent = 'Date of Birth is required';
        isValid = false;
    }


    if (selectedGender) {
        genderError.textContent = '';
    } else {
        genderError.textContent = 'Please select a gender';
        isValid = false;
    }


    if (qualifications === '') {
        document.getElementById('QualificationsError').textContent = 'Qualifications is required';
        isValid = false;
    }


    if (address === '') {
        document.getElementById('AddressError').textContent = 'Address is required';
        isValid = false;
    }


    if (country === 'select country') {
        document.getElementById('countryError').textContent = 'country is required';
        isValid = false;
    }

    if (state === 'select State') {
        document.getElementById('StateError').textContent = 'state is required';
        isValid = false;
    }


    if (city === '') {
        document.getElementById('CityError').textContent = 'city is required';
        isValid = false;
    }

    if (pin === '') {
        document.getElementById('pinError').textContent = 'pin is required';
        isValid = false;
    }


    document.getElementById('add_employee_form').addEventListener('input', (event) => {
        DataName = event.target.id;
        let errorId = `${DataName}Error`;

        document.getElementById(errorId).textContent = '';

    });

    return isValid;

}

const maleRadioButton = document.getElementById('male');
const femaleRadioButton = document.getElementById('female');
const genderError = document.getElementById('genderError');

maleRadioButton.addEventListener('click', () => {
    genderError.textContent = '';
});

femaleRadioButton.addEventListener('click', () => {
    genderError.textContent = '';
});

// ................................validateForm......................................end



//------------ Clear the error messages ---------------start
function clearErrorMessages() {
    const errorElements = document.querySelectorAll('.error');
    errorElements.forEach(function (element) {
        element.textContent = '';
    });
}
// --------------- Clear the error messages ------------end




// ................searchEmployeee....................

function searchInput() {
    let searchValue = document.getElementById("searchInput").value;
    searchValue = searchValue.toLowerCase();
    let rows = document.getElementsByTagName("tr");
    let noEmployeesFoundMessage = document.getElementById("noEmployeeMessage");
    let found = false;

    for (let i = 1; i < rows.length; i++) {
        if (!rows[i].innerHTML.toLowerCase().includes(searchValue)) {
            rows[i].style.display = "none";
        } else {
            rows[i].style.display = "";
            found = true;
        }
    }

    if (found) {
        noEmployeesFoundMessage.style.display = "none";

    } else {
        noEmployeesFoundMessage.style.display = "block";
    }
}




// ......................image-Post-view..................
const upload_file = document.getElementById("upload_file");
upload_file.addEventListener("change", uploadImage);

function uploadImage() {
    const imgLink = URL.createObjectURL(upload_file.files[0]);
    const imgView = document.getElementById("image");
    imgView.src = imgLink;
    const cardImg = document.getElementById("card-img");
    const hidden = document.getElementById('hidden');
    hidden.style.display = "none";
    cardImg.style.display = "flex";
    cardImg.style.justifyContent = "center"

    const border = document.getElementById('img-view');
    border.style.width = "200px";
    const imageError = document.getElementById('imageError').style.display = "none";

}




// -----------------edit employee upload image-------------------------------start

// const edit_upload_file = document.getElementById("edit_upload_file");
// const selectedImage = document.getElementById("edit_img");

// edit_upload_file.addEventListener("change", (e) => {
//     e.preventDefault();
//     const file = edit_upload_file.files[0];

//     if (file) {
//         const imgLink = URL.createObjectURL(file);
//         selectedImage.src = imgLink;
//         selectedImage.style.width = "110px";
//         selectedImage.style.height = "110px";
//     } else {
//         selectedImage.src = "";
//     }
//     get_emp();
// });

// const changeButton = document.querySelector("button");
// changeButton.addEventListener("click", changeImage);

// function changeImage(event) {
//     event.preventDefault();

// }

let selectedImage = document.getElementById('edit_img');
let edit_upload_file = document.getElementById('edit_upload_file');
edit_upload_file.onchange = function () {
    selectedImage.src = URL.createObjectURL(edit_upload_file.files[0]);
    selectedImage.style.width = "110px";
    selectedImage.style.height = "110px";

}



// -----------------edit employee upload image-------------------------------end



// ---------------------------add-popup-modal--------------------------start
function showPopup() {

    close_btn()
    var overlay = document.getElementsByClassName("overlay")[0];
    overlay.style.display = "block";
    document.getElementById("employee_add").style.display = "block";

    clearForm();
}

function closePopup() {
    document.getElementById("employee_add").style.display = "none";
    var overlay = document.getElementsByClassName("overlay")[0];
    overlay.style.display = "none";
}
// ---------------------------add-popup-modal------------------------end

// -----------------delete-popup-modal------------------start
function deleteshowPopup() {
    var overlay = document.getElementsByClassName("overlay")[0];
    overlay.style.display = "block";
    document.getElementById("employee_delete").style.display = "block";


}
function PopupDeleteclose() {
    document.getElementById("employee_delete").style.display = "none";
    var overlay = document.getElementsByClassName("overlay")[0];
    overlay.style.display = "none";
}
// -----------------delete-popup-modal------------------end

// --------------edited-popup-modal-----------------start
function EditedshowPopup() {
    var overlay = document.getElementsByClassName("overlay")[0];
    overlay.style.display = "block";
    document.getElementById("employee_edited").style.display = "block";
    clearForm();

}
function PopupEditedclose() {
    document.getElementById("employee_edited").style.display = "none";
    var overlay = document.getElementsByClassName("overlay")[0];
    overlay.style.display = "none";
    location.reload();
    clearForm();
}
// ---------------------edited-popup-modal------------end




// --------------------------form-clear---------------------------start
function clearForm() {
    // document.getElementById("Salutation").value = "";
    // document.getElementById("firstName").value = "";
    // document.getElementById("LastName").value = "";
    // document.getElementById("Email").value = "";
    // document.getElementById("Phone").value = "";

    // const genderRadios = document.querySelectorAll('input[name="gender"]');
    // genderRadios.forEach((radio) => {
    //     radio.checked = false;
    // });
    // document.getElementById('dob').value = "";
    // document.getElementById("Qualifications").value = "";
    // document.getElementById('Address').value = "";
    // document.getElementById("country").value = "";
    // document.getElementById("State").value = "";
    // document.getElementById("City").value = "";
    // document.getElementById("pin").value = "";
    // document.getElementById('drop-area').value = "";

    const upload_file = document.getElementById('upload_file').form;
    upload_file.reset();
    const imgView = document.getElementById("image");
    imgView.src = "";
    // const upload_file =document.getElementById('upload_file');
    // upload_file.value="";
    const hidden = document.getElementById('hidden');
    hidden.style.display = "block";
    const cardImg = document.getElementById("card-img");

    cardImg.style.display = "block";
    const border = document.getElementById('img-view');
    border.style.width = "";

    get_emp()
}

// --------------------------form-clear---------------------------end
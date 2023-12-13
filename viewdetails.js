const url = new URL(window.location.href);
const id = url.searchParams.get('id');
console.log(id);
// -------------------------------------VIEW EMPLOYEE------------------------------- start
viewDetails(id);

function viewDetails(id) {

    fetch(`http://localhost:3000/employees/${id}`)
        .then(res => {
            return res.json();
        })
        .then(data => {

            document.getElementById('EmployeeProfilePic').innerHTML = ` <img src="http://localhost:3000/employees/${id}/avatar">`
            const fullName = data.salutation + " " + data.firstName + " " + data.lastName;
            document.getElementById('EmployeeName').innerHTML = fullName;
            document.getElementById('EmployeeEmail').innerHTML = data.email;
            document.getElementById('Gender').innerHTML = data.gender;
            document.getElementById('Dob').innerHTML = data.dob;
            const DOB = changeformatYMD(data.dob);
            const age = calculateAge(DOB);
            document.getElementById('Age').innerHTML = age;
            document.getElementById('PhoneNumberDetails').innerHTML = data.phone;
            document.getElementById('QualificationsDetails').innerHTML = data.qualifications;
            document.getElementById('AddressDetails').innerHTML = data.address;
            document.getElementById('UsernameDetails').innerHTML = data.username;
        });
}

function calculateAge(dateOfBirth) {
    const dob = new Date(dateOfBirth);
    const currentDate = new Date();
    const timeDiff = currentDate - dob;
    const age = Math.floor(timeDiff / (365.25 * 24 * 60 * 60 * 1000));
    return age;
}
function changeformatYMD(DOB) {
    const [date, month, year] = DOB.split("-");
    let formatteddate = year + "-" + month + "-" + date;
    return formatteddate;
}
// -------------------------------------VIEW EMPLOYEE------------------------------------------------- End

function deleteView(id) {
    fetch(`http://localhost:3000/employees/${id}`, {
        method: 'DELETE',
    }
    ).then(response => response.json())
        .then(data => {
            console.log('API Response:', data);
            deleteshowPopup();
        })
        .catch(error => {
            console.error('Error:', error);
        });

}
const deleteViewEvent = document.getElementById('delete_btn_action');
deleteViewEvent.addEventListener("click", () => {
    console.log(id);
    deleteView(id);
    delete_close_btn();

})
// -------------------------------delete-form------start
function deleteEmp() {
    var delete_form = document.getElementsByClassName("delete_btn_form")[0];
    delete_form.style.display = "block";
    var overlay = document.getElementsByClassName("overlay")[0];
    overlay.style.display = "block";

}
function delete_close_btn() {
    var close_btn = document.getElementsByClassName("delete_btn_form")[0];
    close_btn.style.display = "none";
    var overlay = document.getElementsByClassName("overlay")[0];
    overlay.style.display = "none";
}
// -------------------------------delete-form------end



// -----------------delete-popup-modal------------------start
function deleteshowPopup() {
    const overlay = document.getElementsByClassName("overlay")[0];
    overlay.style.display = "block";
    document.getElementById("employee_delete").style.display = "block";


}
function PopupDeleteclose() {
    document.getElementById("employee_delete").style.display = "none";
    const overlay = document.getElementsByClassName("overlay")[0];
    overlay.style.display = "none";
    window.location.href = "index.html";
}
// -----------------delete-popup-modal------------------end



//----------------- edit-details --------------------start
function EditDetails() {
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
     
  })

  .catch(error => {
      console.error('error:', error);
  })

const editBtn = document.getElementById('savechange');
editBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  editEmployee(id);

  edit_close_btn();
 
});

}

function editEmployee(id) {
    
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
    // const edit-upload_file = document.getElementById("edit_upload_file");
    const formData = new FormData();
    formData.append("avatar", edit_upload_file.files[0]);

    fetch(`http://localhost:3000/employees/${id}/avatar`, {
        method: "POST",
        body: formData

    })

        .then(data => {
            console.log('API Response:', data);
            
           
            EditedshowPopup();
           
        })

        .catch(error => {
            console.error('Error:', error);
        });
}
// .............................put-method................................-end
var edit_upload_file = document.getElementById("edit_upload_file");
const selectedImage = document.getElementById("edit_img");

edit_upload_file.addEventListener("change", (e) => {
    e.preventDefault();
    const file = edit_upload_file.files[0];

    if (file) {
        const imgLink = URL.createObjectURL(file);
        selectedImage.src = imgLink;
        selectedImage.style.width = "110px";
        selectedImage.style.height = "110px";
    } else {
        selectedImage.src = "";
    }
    get_emp();
});

const changeButton = document.querySelector("button");
changeButton.addEventListener("click", changeImage);

function changeImage(event) {
    event.preventDefault();

}

function edit_close_btn() {
    var close_btn = document.getElementsByClassName("edit_employee")[0];
    close_btn.style.display = "none";
    var overlay = document.getElementsByClassName("overlay")[0];
    overlay.style.display = "none";

}
//----------- edit_pop ----------
function EditedshowPopup() {
    var overlay = document.getElementsByClassName("overlay")[0];
    overlay.style.display = "block";
    document.getElementById("employee_edited").style.display = "block";

   
}
function PopupEditedclose() {
    document.getElementById("employee_edited").style.display = "none";
    var overlay = document.getElementsByClassName("overlay")[0];
    overlay.style.display = "none";
    location.reload();
    
}
// ---------------------edited-popup-modal------------end

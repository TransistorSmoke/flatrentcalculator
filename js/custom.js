 /* --- AUTO FILL YEAR FIELD FOR REGISTER PUB PAGE  --*/

// var billingDate = new Date();
// document.getElementById('billing-date').value = billingDate.getFullYear();


function myFunction(){

    var myArgs = document.getElementById('pub_duration').value;
    var newArgs = myArgs.split(',');

    var cost = newArgs[0];
    var datefrom = newArgs[1];
    var dateto = newArgs[2];
    var durationYear = newArgs[3];

    alert(
        "MYARGS = " + newArgs + "\n" +
        "COST = " + cost + "\n" +
        "DATE FROM = " + datefrom + "\n" +
        "DATE TO = " + dateto + "\n" +
        "DURATION YEAR = " + durationYear
        ); 
}
/* ----------------------------------------------- */

/*---- ===== REGISTER PAGE - Check date durations ===== ----*/
function regCompareDates(){
        var fieldDateFrom = document.getElementById("date-from");
        var fieldDateTo = document.getElementById("date-to");
        var dateFrom = moment(fieldDateFrom.value);
        var dateTo = moment(fieldDateTo.value);
    

      if((dateFrom != NaN) && (dateTo != NaN)){
          if((dateFrom > dateTo) || (dateFrom == dateTo)){
            //   alert("DATE FROM is GREATER THAN DATE TO..... NOT GOOD!");
             $("#reg-date-error").modal('show');
              fieldDateFrom.value = '';
              fieldDateTo.value = '';
          }
      }
}






/* CALCULATE PAGE - Field change depending on PUB DURATION INFO --- */
function displayPUBCost(){
    var shareArg =   document.getElementById('pub_duration').value.split(',');
    document.getElementById('pub_cost').value = shareArg[0];  
}


function radioButtonCheck(){
    var radioStatus = document.getElementById('radio_yes').checked;

   if(radioStatus == true){
       document.getElementById('pub-headcount').style.display = 'block';
   } else{
    document.getElementById('pub-headcount').style.display = 'none';
   }
}

function toggleShareDisplay(){
    var buttonText = document.getElementById('toggle-share-display').innerHTML;
    if(buttonText == 'Show Share Distribution'){
        document.getElementById('share-distribution-main').style.display = 'block';
        document.getElementById('toggle-share-display').innerHTML = 'Hide Share Distribution';
    } else{
        document.getElementById('share-distribution-main').style.display = 'none';
        document.getElementById('toggle-share-display').innerHTML = 'Show Share Distribution';    
    }
}


function saveSharesToDB(){
    document.getElementById('save-share').submit();
}





/* ====== Saving of a section to PDF (used for converting rent share data to PDF) ===== */
function saveDistributionToPDF(){
    var shareDistributionFileName  = 'share-distribution.pdf';
    html2canvas(document.getElementById('share-distribution')).then(function(canvas){
        var pdf = new jsPDF('p', 'mm', 'a4', true);
        var imageShot = canvas.toDataURL('image/png'); 
        pdf.addImage(imageShot, 'JPEG', 10, 10, 190, 250, 'FAST');
        pdf.save(shareDistributionFileName);
    }); 
}

function saveSharesToPDF() {
    var rentShareFileName  = 'rent-share.pdf';
    html2canvas(document.getElementById('pdf-share-summary')).then(function(canvas){
        var pdf = new jsPDF('p', 'mm', 'a4', true);
        var imageShot = canvas.toDataURL('image/png'); 
        pdf.addImage(imageShot, 'JPEG', 10, 10, 190, 82, 'FAST');
        pdf.save(rentShareFileName);
    });
}



/* ====== Saving of a section to a screenshot (image, for better image quality) ===== */
function saveDistributionToImg(){
    html2canvas(document.getElementById('share-distribution')).then(function(canvas){
        var imageShot = canvas.toDataURL('image/png'); 
        // document.querySelector(".rendered-canvas").appendChild(canvas);
        var imageShotSave = imageShot.replace(/^data:image\/png/, "data:application/octet-stream");
        $("#generate-img-distribution").attr("download", "share_distribution.png").attr("href", imageShotSave);
    });
}

function saveSummaryToImg(){
    html2canvas(document.getElementById('pdf-share-summary')).then(function(canvas){
        var imageShot = canvas.toDataURL('image/png'); 
        // document.querySelector(".rendered-canvas").appendChild(canvas);
        var imageShotSave = imageShot.replace(/^data:image\/png/, "data:application/octet-stream");
        $("#generate-img-summary").attr("download", "share_summary.png").attr("href", imageShotSave);
    });
}




function changeLocation() {
    console.log("location changed");
    $("#changeLocationForm").submit();
    $("#locationChangeDiv").css("visibility", "hidden");
}

function showLocationChange() {
    console.log('change open');
    $("#locationChangeDiv").css("visibility", "visible");
}

function closeLocationChangeDiv() {
    $("#locationChangeDiv").css("visibility", "hidden");
}

function setToCurrentLocation() {
    $("newLocation").val("");
}

function createPlayTimeDiv(data, selectedDate) {
    let html = "";
    if (data.showTimes) {
    for (let movieTime of data) {
        if (selectedDate == movieTime.date) {
            console.log('movie', movieTime);
            html += "<div class='moviePoster flex-transforming gap_10 padding_20'>" +
                "<div class='poster gap_10'><img src='/' alt=''>" +
                "<div class='flex-column'><label class='posterTitle'>" + movieTime.name + "</label><label>Short description<label></div></div>" +
                "<div class='showingTimes'><img src='"+data.thumbnail+"'><div>"+data.title+ ", Adress: " +data.addr+"</div>";
            for (let time of movieTime.showing[0].time) {
                console.log('time', time);
                html += "<div>" + time + "</div>";
            }
            html += "</div></div>";
            console.log(html);
        }
    }
    }
    return html;
}

/*   <!-- <% for (let movieTime of showtimes) {%>
                <div class='moviePoster'>
                    <div class='poster'><img src="/" alt=""></div>
                    <div><label><%=movieTime.name%></label></div>
                    <div class='showingTimes'>
                    <% for (let time of movieTime.showing[0].time) {%>
                        <div><%=time%></div>
                    <%}%> 
                    </div>
                </div>
            <%}%> -->*/
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

function createPlayTimeDiv(data, selectedDate, filterBydMovieId) {
    
    let html = "<div class='theatreBox'><h2>Now playing at "+data.theaterName+"</h2><div class='theatreShowTimeList'>";
    let count = 0;
    if (data.showTimes) {
        console.log("inside data.showTimes");
        for (let movieTime of data.showTimes) {
            console.log(selectedDate, movieTime.date);
            if (selectedDate == movieTime.date) {
                for (let movie of movieTime.movies) {
                    if (movie.movieDetail && (!filterBydMovieId || movie.movieDetail.movie_id == filterBydMovieId)) {
                        count++;
                        console.log('movies are same', movie);
                        html += "<div class='moviePoster flex-transforming gap_10' onclick='goToDetail(\"" + movie.movieDetail.movie_id + "\")'>";
                            html += "<div class='poster gap_10 flex-transforming'><img src='https://image.tmdb.org/t/p/w500" + movie.movieDetail.poster_path + "' alt=''>";
                                html += "<div class='flex-column padding_10'><div class='posterTitle'>" + movie.name + "</div>"+
                                        "<label class='lightText'>"+movie.movieDetail.release_date+ "</label><br/>"+
                                        "<label class='lightText'>Rating: " +movie.movieDetail.vote_average+"</label></div></div>";
                                html += "<div class='gap_5 padding_10 flex-column'><div class='typeText'>"+(movie.showing[0].type?movie.showing[0].type:'Standard')+"</div>";
                        for (let time of movie.showing[0].time) {
                            //console.log('time', time);
                            html += "<div>" + time + "</div>";
                        }
                        html += "</div></div>";
                    }
                }

                console.log(html);
            }
        }
    } if (count==0) {
        html += "<br><label class='notFound lightText'>Sorry we could not find any showtimes for selected date</label>";
    }
    html += "</div></div>";
    return html;
}

function goToDetail(movieId) {
    const url = `/movie_details/${movieId}`;
    window.location.href = url;
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
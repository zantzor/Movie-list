window.addEventListener("load", function (){
	let db = firebase.database();
	let movieList = document.getElementById("movieList");
	let inputTitle = document.getElementById("inputTitle");
	let inputDirector = document.getElementById("inputDirector");
	let inputYear = document.getElementById("inputYear");
	let addBtn = document.getElementById("addBtn");
	let editConfirm = document.getElementById("editConfirm");
	let editCancel = document.getElementById("editCancel");
	let sortTitle = document.getElementById("sortTitle");
	let sortDir = document.getElementById("sortDir");
	let sortYear = document.getElementById("sortYear");
	let titleSortDirection = document.getElementById("titleSortDirection");
	let dirSortDirection = document.getElementById("dirSortDirection");
	let yearSortDirection = document.getElementById("yearSortDirection");
	let filterInput = document.getElementById("filterInput");
	let left = document.getElementById("left");
	let right = document.getElementById("right");
	let pagination = document.getElementById("pagination");
	let pageNr = document.getElementById("pageNr");
	let resultsPerPage = document.getElementById("resultsPerPage");
	let info = document.getElementById("info");
	let titleCount = 0;
	let dirCount = 0;
	let yearCount = 0;

	left.style.display = "none";

	function createMovieList(title, director, year, key, sort){
		let newDiv = document.createElement("div");
		let newTitle = document.createElement("p");
		let editBtn = document.createElement("a");
		let delBtn = document.createElement("a");

		newDiv.id = key;
		newDiv.classList.add("movieDiv");
		newTitle.innerText = `${title} by director ${director} in year ${year}`;
		editBtn.title = "Click to edit movie";
		delBtn.title = "Click to delete movie";
		delBtn.style.color = "red";
		editBtn.style.color = "gold"
		editBtn.innerHTML = "&#9998";
		delBtn.innerHTML = 	"&#10008";
		editBtn.href = "#";
		delBtn.href = "#";
		info.innerText = "";

		if(sort % 2 > 0){
			movieList.appendChild(newDiv);
			newDiv.appendChild(newTitle);
			newDiv.appendChild(editBtn);
			newDiv.appendChild(delBtn);
		}
		else{
			movieList.insertBefore(newDiv, movieList.childNodes[0])
			newDiv.appendChild(newTitle);
			newDiv.appendChild(editBtn);
			newDiv.appendChild(delBtn);
		}
		
		if (resultsPerPage.value.length !== 0){
			getItemsPerPage(1);
		}

		delBtn.addEventListener("click", function(){
			db.ref("/" + key).remove();
			document.getElementById("idKey").value = "";
			inputTitle.value = "";
			inputDirector.value = "";
			inputYear.value = "";
			editConfirm.classList.add("hidden");
			editCancel.classList.add("hidden");
			addBtn.classList.remove("hidden");
			info.innerText = "Movie has been deleted";
		})

		editBtn.addEventListener("click", function(){
			let editObj = {
				editTitle: title,
				editDir: director,
				editYear: year
			}
			document.getElementById("idKey").value = key;
			inputTitle.value = editObj.editTitle;
			inputDirector.value = editObj.editDir;
			inputYear.value = editObj.editYear;

			addBtn.classList.add("hidden");
			editConfirm.classList.remove("hidden");
			editCancel.classList.remove("hidden");
			info.innerText = "";

		})

	}

	resultsPerPage.addEventListener("keyup", function(event){
		if(resultsPerPage.value > movieList.childNodes.length)event.preventDefault();
		else if(resultsPerPage.value.length === 0){
			pageNr.value = 1;
			right.style.display = "none";
			left.style.display = "none";
			for(let i = 0; i < movieList.childNodes.length; i++){
				movieList.childNodes[i].classList.remove("hidden");
			}
		}
		else{
			right.style.display = "inline";
			pageNr.value = 1;

			getItemsPerPage(1);
		}	
	})

	pageNr.addEventListener("keyup", function(event){
		if (pageNr.value.length === 0 || pageNr.value <= 0) {
			right.style.display = "none";
			left.style.display = "none";
			for(let i = 0; i < movieList.childNodes.length; i++){
				movieList.childNodes[i].classList.remove("hidden");
			}
			event.preventDefault();
		}
		else if(pageNr.value > Math.ceil(movieList.childNodes.length / resultsPerPage.value)){
			pageNr.value = Math.ceil(movieList.childNodes.length / resultsPerPage.value);
			getItemsPerPage(pageNr.value);
		}
		else{
			getItemsPerPage(pageNr.value);
		}
	})

	left.addEventListener("click", function(event){
		if(pageNr.value == 1){
			left.style.display = "none";
			event.preventDefault();
		}
		else{
			right.style.display = "inline";
			pageNr.value--
			let page = pageNr.value;
			getItemsPerPage(page);
		}
	})

	right.addEventListener("click", function(event){
		console.log(movieList.lastChild.classList[1])
		if (movieList.lastChild.classList[1] === undefined) event.preventDefault();
		else{
			left.style.display = "inline";
			pageNr.value++;
			let page = pageNr.value;
			getItemsPerPage(page);
		}
	})

	addBtn.addEventListener("click", function (){
		if((inputTitle.value.length > 0) && (inputDirector.value.length > 0) && (inputYear.value.length > 0)){
			let movieObj = {
				movie: inputTitle.value,
				director: inputDirector.value,
				year: inputYear.value
			}
			db.ref("/").push(movieObj);
			inputTitle.value = "";
			inputDirector.value = "";
			inputYear.value = "";
			info.innerText = "Movie has been successfully been added to the database";
		}
		else{
			info.innerText = "All fields must be filled";
		}
	})

	editConfirm.addEventListener("click", function(){
		let idKey = document.getElementById("idKey");
		if((inputTitle.value.length > 0) && (inputDirector.value.length > 0) && (inputYear.value.length > 0)){
			let movieObj = {
				movie: inputTitle.value,
				director: inputDirector.value,
				year: inputYear.value
			}
			db.ref("/" + idKey.value).set({
				movie: inputTitle.value,
				director: inputDirector.value,
				year: inputYear.value
			})
			inputTitle.value = "";
			inputDirector.value = "";
			inputYear.value = "";

			addBtn.classList.remove("hidden");
			editConfirm.classList.add("hidden");
			info.innerText = "Movie has been successfully edited";
		}
		else{
			info.innerText = "All fields must be filled";
		}
	})
	editCancel.addEventListener("click", function(){
		document.getElementById("idKey").value = "";
		inputTitle.value = "";
		inputDirector.value = "";
		inputYear.value = "";
		editConfirm.classList.add("hidden");
		editCancel.classList.add("hidden");
		addBtn.classList.remove("hidden");
	})

	sortTitle.addEventListener("click", function(){
		titleCount++;
		if(titleSortDirection.innerText == "Ascending")titleSortDirection.innerText = "Descending";
		else titleSortDirection.innerText = "Ascending";
		sortList("movie", titleCount);
		
	})

	sortDir.addEventListener("click", function(){
		dirCount++;
		if(dirSortDirection.innerText == "Ascending")dirSortDirection.innerText = "Descending";
		else dirSortDirection.innerText = "Ascending";
		sortList("director", dirCount);
		
	})

	sortYear.addEventListener("click", function(){
		yearCount++;
		if(yearSortDirection.innerText == "Ascending")yearSortDirection.innerText = "Descending";
		else yearSortDirection.innerText = "Ascending";
		sortList("year", yearCount);
		
	})

	function sortList(value, count){
		info.innerText = "";
		pageNr.value = 1;
		movieList.innerText = "";
		db.ref("/").orderByChild(value).once("value", function(snapshot){
			snapshot.forEach(child => {
				let sortObj = child.val()
				console.log(sortObj);
				createMovieList(sortObj.movie, sortObj.director, sortObj.year, child.key, count)
			})
		})
	}

	function getItemsPerPage(currentPage, /*direction*/){
		info.innerText = "";
		let totalPages = Math.ceil(movieList.childNodes.length / resultsPerPage.value);
		let start = resultsPerPage.value * currentPage - Number(resultsPerPage.value);
		//console.log(start);
		if(currentPage == 1){
			left.style.display = "none";
			right.style.display = "inline";
		}
		else{
			left.style.display = "inline";
			right.style.display = "inline";
		}
		console.log(resultsPerPage.value * currentPage - Number(resultsPerPage.value));
		for(let i = 0; i < movieList.childNodes.length; i++){
			movieList.childNodes[i].classList.add("hidden");
			console.log(movieList.childNodes.length - Number(resultsPerPage.value) + 1);
			for (let y = (currentPage - 1) * resultsPerPage.value; y < (currentPage * resultsPerPage.value); y++){
				/*if(y > resultsPerPage.value * currentPage - Number(resultsPerPage.value)){*/
				if(currentPage == totalPages ){
					right.style.display = "none";
					for(let x = y; x < movieList.childNodes.length; x++){
						movieList.childNodes[x].classList.remove("hidden");
						console.log("Kolla: " + currentPage, i)
					}
				}
				else{	
					movieList.childNodes[y].classList.remove("hidden");
				}
			}
		}
	}

	filterInput.addEventListener("keyup", function(){
		let movieParagraph;
		pageNr.value = 1;
		resultsPerPage.value = "";
		for(let i = 0; i < movieList.childNodes.length; i++){
			movieParagraph = movieList.childNodes[i].getElementsByTagName("p")[0];
			if(movieParagraph.innerHTML.toUpperCase().indexOf(filterInput.value.toUpperCase()) > -1){

				movieList.childNodes[i].classList.remove("hidden");
			}
			else{
				movieList.childNodes[i].classList.add("hidden");
			}
		}
	})
	
	db.ref("/").on("child_added", function(snapshot, prevChildKey){
	let data = snapshot.val();
	let movieKey = snapshot.key;

	createMovieList(data.movie, data.director, data.year, movieKey, 1);
	})
	
	db.ref("/").on("child_removed", function(snapshot){
		let data = snapshot.val();
		let movieKey = snapshot.key;

		document.getElementById(movieKey).remove();
	})

	db.ref("/").on("child_changed", function(snapshot){
		let data = snapshot.val();
		let movieKey = snapshot.key;

		document.getElementById(movieKey).firstChild.innerText = `${data.movie} by director ${data.director} in year ${data.year}`;
	})

})
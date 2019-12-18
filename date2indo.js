const monthInIndo = ['Januari', 'Februari', 'Maret', 'April', 'Mei',
					 'Juni', 'Juli', 'Agustus', 'September', 'Oktomber',
					 'November', 'Desember']

module.exports = function convertDate( datenow ){

	var splitDate = datenow.split(" ")
	const newDate = splitDate[0] + " " + monthInIndo[splitDate[1] - 1] + " " + splitDate[2] + " " + splitDate[3]
	return newDate
}

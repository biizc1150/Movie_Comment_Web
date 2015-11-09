$(document).ready(function() {
    $('#commentDiv').hide();
    $('#detailDiv').hide();
    $('#editDiv').hide();
    $('#add_movie_div').hide();



    var movieObject_all;

    var show = false;

    $.getJSON('http://omaximumo.asuscomm.com/movie/allmovie.php', function(data) {
        var content = '';
        movieObject_all = data;
        for (var i = 0; i < data.length; i++) {
            content += '<tr><td>' + data[i].movie_name + '</td>' + '<td>' + data[i].movie_decription + '</td>' +
                '<td><button type="button" class="btn btn-default comment">Comment</button></td>' +
                '<td><button type="button" class="btn btn-info lookdetail" id="">LOOK DETAIL</button></td>' +
                '<td><button type="button" class="btn btn-warning editDetail" id="">EDIT</button></td>' +
                '<td><button type="button" class="btn btn-danger deleteDetail" id="">DELETE</button></td></tr>';
        }

        $('#allMove_table').append(content);
        //data is the JSON string

        // console.log(movieObject_all);

        $("#allMove_table").on('click', '.comment', function() {
            // alert(show);
            if (show == true) {
                location.reload();
            }
            $('#detailDiv').hide();
            $('#editDiv').hide();
            $('#add_movie_div').hide();

            var indexClick = $(this).closest('td').parent()[0].sectionRowIndex;
            var movieName = '';
            $.getJSON('http://omaximumo.asuscomm.com/movie/getcomment.php?id=' + movieObject_all[indexClick].movie_id, function(data2) {
                show = true;

                if (data2.length == 0) {
                    // No any record
                    movieName = data[indexClick].movie_name;
                    $('#comment_table').html('');
                    $("#commentDiv").show();
                    $('#movieTitle').html(movieName);

                    //Confirm Comment
                    $('#confirm_comment').click(function() {
                        var name = $('#name').val();
                        var comment = $('#comment').val();
                        var ratting = $('#ratting').val();

                        $.getJSON('http://omaximumo.asuscomm.com/movie/comment.php?name=' + name + '&movie=' + movieName +
                            '&comment=' + comment + '&rating=' + parseFloat(ratting) + '&id=' + movieObject_all[indexClick].movie_id,
                            function(data) {
                                
                                location.reload();
                            });
                    });
                    return;
                }

                //Pass Condition
                movieName = data2[0].movie_name;
                $('#movieTitle').html(movieName);
                var contents = '';
                //Check Wether is empty ?

                for (var i = 0; i < data2.length; i++) {
                    contents += 'Comment ' + (i + 1) + '</br><label>' + data2[i].name + ':&nbsp;&nbsp;</label>' +
                        '<label>' + data2[i].comment_detail + '</label></br>';
                }

                $('#comment_table').html(contents);
                $("#commentDiv").show();

                //Confirm Comment
                $('#confirm_comment').click(function() {
                    // alert('in2');
                    var name = $('#name').val();
                    var comment = $('#comment').val();
                    var ratting = $('#ratting').val();
                    // alert(comment + ' ' + ratting);

                    $.getJSON('http://omaximumo.asuscomm.com/movie/comment.php?name=' + name + '&movie=' + movieName +
                        '&comment=' + comment + '&rating=' + parseFloat(ratting) + '&id=' + movieObject_all[indexClick].movie_id,
                        function(data) {
                            show = true;
                            location.reload();
                            return;
                        });
                    alert('added !');
                    return;

                });
                $('#cancel_comment').click(function() {
                    $("#commentDiv").hide();
                    $('#comment').val('');
                    $('#ratting').val('1');
                });

            });
            // alert("row" + $(this).closest('td').parent()[0].sectionRowIndex + "LookDetail");
        });
        $("#allMove_table").on('click', '.lookdetail', function() {
            $('#commentDiv').hide();
            $('#editDiv').hide();
            $('#add_movie_div').hide();

            var indexClick = $(this).closest('td').parent()[0].sectionRowIndex;
            $.getJSON('http://omaximumo.asuscomm.com/movie/getdetail.php?id=' + movieObject_all[indexClick].movie_id, function(data3) {
                if (data3[0] == undefined) {
                    $('#detailDiv').show();
                    $('#movie_name_detail').html(movieObject_all[indexClick].movie_name);
                    $('#movie_des_detail').html(movieObject_all[indexClick].movie_decription);
                    $('#movie_rating_detail').html('10 / None');

                    return;
                }

                $('#detailDiv').show();

                $('#movie_name_detail').html(data3[0].movie_name);
                $('#movie_des_detail').html(data3[0].movie_decription);

                //Calculate Rating
                var rating_avg = 0.0;
                for (var i = 0; i < data3.length; i++) {
                    rating_avg += parseFloat(data3[i].Rating);
                }

                rating_avg /= data3.length;

                $('#movie_rating_detail').html('10 / ' + rating_avg.toFixed(2));

                $('#close_detail_btn').click(function() {
                    $('#detailDiv').hide();
                });
            });

            // alert("row" + $(this).closest('td').parent()[0].sectionRowIndex + "LookDetail");
        });

        $("#allMove_table").on('click', '.editDetail', function() {
            $('#commentDiv').hide();
            $('#detailDiv').hide();
            $('#add_movie_div').hide();

            var indexClick = $(this).closest('td').parent()[0].sectionRowIndex;
            $('#editDiv').show();
            $('#movie_name_edit').val(movieObject_all[indexClick].movie_name);
            $('#movie_des_edit').val(movieObject_all[indexClick].movie_decription);

            // alert("row" + $(this).closest('td').parent()[0].sectionRowIndex + "Edit");

            // indexClick + 1

            $('#update_btn').click(function() {
                var newName = $('#movie_name_edit').val();
                var newDetail = $('#movie_des_edit').val();

                $.getJSON('http://omaximumo.asuscomm.com/movie/editmovie.php?m_name=' + newName + '&des=' + newDetail + '&id=' + movieObject_all[indexClick].movie_id, function(data) {
                    alert("Update Successful !!");
                    $('#editDiv').hide();
                    $('#movie_name_edit').val('');
                    $('#movie_des_edit').val('');
                    location.reload();
                });
            });

            $('#cancel_update_btn').click(function() {
                $('#editDiv').hide();
                $('#movie_name_edit').val('');
                $('#movie_des_edit').val('');
            });

        });

        $("#allMove_table").on('click', '.deleteDetail', function() {
            var indexClick = $(this).closest('td').parent()[0].sectionRowIndex;

            // ask before delete statment
            if (confirm('Are you sure to delete this movie from the database?')) {
                //Execute Delete Query
                $.getJSON('http://omaximumo.asuscomm.com/movie/deletemovie.php?id=' + movieObject_all[indexClick].movie_id, function(data) {
                    alert('Delete Successful !!');
                    //Reload page
                    location.reload();
                });
            } else {
                // Do nothing!
            }
        });

        //Add new movie
        $('#add_movie_btn').click(function() {
            $('#commentDiv').hide();
            $('#detailDiv').hide();
            $('#editDiv').hide();

            $('#add_movie_div').show();
        });
        //Cancel Add movie
        $('#cancel_add_btn').click(function() {
            $('#add_movie_div').hide();
            $('#add_movie_name').val('');
            $('#add_movie_des').val('');
        });
        //Insert new movie to DB.
        $('#insert_movie_btn').click(function() {
            var moviewName = $('#add_movie_name').val();;
            var movieDes = $('#add_movie_des').val();;
            $.getJSON('http://omaximumo.asuscomm.com/movie/createmovie.php?m_name=' + moviewName + '&des=' + movieDes, function(data) {
                alert("Adding successful !");
                location.reload();
            });
        });


    });


});
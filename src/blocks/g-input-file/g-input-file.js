o2.gInputFile =
{
	fileSelection()
	{
	  $(".g-input-file__file-inp").change(function()
		{
	        var filename = $(this).val().replace(/.*\\/, "");
	        $(".g-input-file__file-nm").html(filename);
	    });
	}
}
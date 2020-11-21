o2.gInputFile =
{
	fileSelection()
	{
		$(".g-input-file__file-inp").on('change',(event)=>{
			let fileList = event.target.files;
			for (i = 0; i < fileList.length; i++)
			{
				var reader = new FileReader();
				if(fileList[i].type === "image/png" || fileList[i].type === "image/jpg" || fileList[i].type === "image/jpeg")
				{
					reader.onload = function(event)
					{
						$('<div class = "g-input-file__img"><img class = "g-input-file__img-close" src = "/src/assets/svg/close.svg" onclick = "o2.gInputFile.close(this)"><img class = "g-input-file__img-image" src = "'+event.target.result+'"></div>').appendTo($('.g-input-file__gallery'));
					}
				}
				else
					$('<div class = "g-input-file__img"><img class = "g-input-file__img-close" src = "/src/assets/svg/close.svg" onclick = "o2.gInputFile.close(this)"><img class = "g-input-file__img-image" src = "/src/assets/svg/close.svg"></div>').appendTo($('.g-input-file__gallery'));
				reader.readAsDataURL(fileList.item(i));
			}
		})
	},
	close(instance)
	{
		let touch = $(instance).parents('.g-input-file__img');
		touch.remove()
	}
}


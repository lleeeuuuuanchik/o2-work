// достать все блоки
// пройтись по twig файлам спарсить классы
// в классах не должно быть классов не совпадающих с названием файла, за исключением g-

const dirTree = require("directory-tree");
const fs = require('fs');

var check =
{
	start()
	{
		const tree = dirTree("./src/blocks/",{extensions:/\.twig$/},(item, PATH, stats) =>
		{
			fs.readFile(item.path, 'utf8', (err,data)=>
			{
				if (err)
					return console.log(err);

				this.checkTwigFile(item,data);
			});
		});
	},

	/**
	 * Console errors
	 * return errors[]
	 */
	checkTwigFile(fileObject,fileContent)
	{
		const regex = /class="([a-zA-Z0-9\-|_ ]*)"/g;
		let m;
		let errors = [];

		while ((m = regex.exec(fileContent)) !== null)
		{
			if (m.index === regex.lastIndex)
				regex.lastIndex++;

			if(typeof m[1] == 'undefined')
				continue;

			errors.push( ...this.checkClassMatching(fileObject,m[1]) );
		}

		if(errors.length > 0)
			for(let error of errors)
				console.error(error);

		return errors;
	},

	exceptions:['container','active','open','error'],

	/**
	 * return errors[]
	 */
	checkClassMatching(fileObject,classes)
	{
		let fileName = fileObject.name.replace(fileObject.extension,'');
		classes = classes.split(/\s+/);
		let errors = [];
		for(let className of classes)
		{
			if(this.exceptions.indexOf(className) !== -1 ||
				className == fileName ||
				className.indexOf(`${fileName}__`) == 0 ||
				className.indexOf('g-') == 0 ||
				className.indexOf('_') == 0
			)
				continue;
			else
				errors.push(`Wrong class name "${className}" Path ${fileObject.path}`);
		}
		return errors;
	}
};

check.start();
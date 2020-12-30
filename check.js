// достать все блоки
// пройтись по twig файлам спарсить классы
// в классах не должно быть классов не совпадающих с названием файла, за исключением g-

const dirTree = require("directory-tree");
const fs = require('fs');

var check =
{
	twigRegex: /class="([a-zA-Z0-9\-|_ ]*)"/g,
	scssRegex: /\.([a-zA-Z0-9\-|_]*)/g,
	maxScssNextingLevel: 10,
	start()
	{
		let twigErrors = null, scssErrors = null;
		const tree = dirTree("./src/blocks/",{extensions:/\.twig$/},(item, PATH, stats) =>
		{
			const file = fs.readFileSync(item.path, 'utf8');

			if (!file)
				process.exit(1);

			twigErrors = this.checkFile(item, file, this.twigRegex);
		});
		scssErrors = this.checkScssFiles();

		if ((scssErrors && scssErrors.length) || (twigErrors && twigErrors.length))
			process.exit(1);
	},
	checkScssFiles()
	{
		let scssErrors = null;
		const tree = dirTree("./src/blocks/",{extensions:/\.scss$/},(item, PATH, stats) =>
		{
			const file = fs.readFileSync(item.path, 'utf8');

			if (!file)
				process.exit(1);

			scssErrors = this.checkFile(item, file, this.scssRegex);
			scssErrors.push(...this.checkNestingLevelError(item, file));
		});
		return scssErrors;
	},
	checkNestingLevelError(fileObject, fileContent)
	{
		let m;
		let errors = [];
		const regex = /{[^}].*?{.*?}/g;
		const nesting = regex.exec(fileContent);

		while ((m = regex.exec(fileContent.replace(/\s/g, ''))) !== null)
		{
			if (m.index === regex.lastIndex)
				regex.lastIndex++;

			if (!m[0])
				continue;

			let nestedLevels = m[0].match(this.scssRegex);
			if (nestedLevels && nestedLevels.length > this.maxScssNextingLevel)
			{
				let error = `Max nesting level is ${this.maxScssNextingLevel}, found ${nestedLevels.length} Path "${fileObject.path}"`;
				errors.push(error);
				console.log(error);
			}
		}
		return errors;
	},
	/**
	 * Console errors
	 * return errors[]
	 */
	checkFile(fileObject,fileContent,regex)
	{
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

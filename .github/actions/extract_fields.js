const fs = require('fs');
const path = require('path');

async function extractFields() {
  try {
    const body = process.env.ISSUE_BODY;

    const issueLabels = JSON.parse(process.env.ISSUE_LABELS);

    const nameRegex = /###\s*名称\s*([\s\S]*?)\s*###/;
    const nameMatch = body.match(nameRegex);
    const name = nameMatch ? nameMatch[1].trim() : '';

    const authorRegex = /###\s*作者\s*([\s\S]*?)\s*###/;
    const authorMatch = body.match(authorRegex);
    const author = authorMatch ? authorMatch[1].trim() : '';

    const styleRegex = /###\s*风格\s*([\s\S]*?)\s*###/;
    const styleMatch = body.match(styleRegex);
    const style = styleMatch ? styleMatch[1].trim() : '';

    const statusRegex = /###\s*状态\s*([\s\S]*?)\s*###/;
    const statusMatch = body.match(statusRegex);
    const status = statusMatch ? statusMatch[1].trim() : '';

    const priceRegex = /###\s*价格\s*([\s\S]*?)\s*###/;
    const priceMatch = body.match(priceRegex);
    const price = priceMatch ? priceMatch[1].trim() : '';

    const platformRegex = /###\s*平台\s*([\s\S]*?)\s*###/;
    const platformMatch = body.match(platformRegex);
    const platform = platformMatch ? platformMatch[1].trim() : '';

    const platformLinkRegex = /###\s*平台链接\s*([\s\S]*?)\s*###/;
    const platformLinkMatch = body.match(platformLinkRegex);
    const platformLink = platformLinkMatch ? platformLinkMatch[1].trim() : '';

    const guideRegex = /###\s*手册\s*([\s\S]*?)\s*###/;
    const guideMatch = body.match(guideRegex);
    const guide = guideMatch ? guideMatch[1].trim() : '';

    const guideLinkRegex = /###\s*手册链接\s*([\s\S]*?)\s*###/;
    const guideLinkMatch = body.match(guideLinkRegex);
    const guideLink = guideLinkMatch ? guideLinkMatch[1].trim() : '';

    let jsonFilePath;
    for (const label of issueLabels) {
      const labelName = label.name;
      if (labelName === 'Java Shader') {
        jsonFilePath = path.join(__dirname, '../../docs/.vuepress/works_json/java_shaders.json');
        break;
      } else if (labelName === 'Java ResourcePack') {
        jsonFilePath = path.join(__dirname, '../../docs/.vuepress/works_json/java_resourcepacks.json');
        break;
      } else if (labelName === 'Bedrock Shader') {
        jsonFilePath = path.join(__dirname, '../../docs/.vuepress/works_json/bedrock_shaders.json');
        break;
      } else if (labelName === 'Bedrock ResourcePack') {
        jsonFilePath = path.join(__dirname, '../../docs/.vuepress/works_json/bedrock_resourcepacks.json');
        break;
      } else {
        console.log('Labels not need');
        process.exit(0);
      }
    }

    // 格式化作品json文件
    const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));

    // 创建新的元素
    const newElement = {
      id: jsonData.length + 1,
      name,
      author,
      style,
      status,
      price,
      platform,
      platform_link: platformLink,
      guide,
      guide_link: guideLink
    };

    // 追加新元素到列表
    jsonData.push(newElement);

    // 将更新后的数据写入 JSON 文件
    fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2));

    console.log('Data appended successfully to JSON file!');
  } catch (error) {
    console.error('Error appending data to JSON file:', error);
    process.exit(1);
  }
}

extractFields();

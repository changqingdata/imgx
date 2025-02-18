// 进一步处理参数，提供可供内容使用的数据结构 SafeProps
import { getGradientTextColor, getTextColor, randomBrightHexColor, randomGradientColors, randomHexColor } from '~/utils/color';

import { getParsedBgColor } from "./template";

interface SafeProps {
  bgColor: string
  bgImage: string
  ratio: number
  padding: string
  fontFamily: string
  closeColorRandom: boolean

  textWrapBgColor: string
  textWrapShadow: string
  textWrapPadding: string
  textWrapRounded: string

  color: string[]
  iconSize: number
  fontSize: number
  accentColor: string[]
  center: string[]
}

export type SafeComponentProps = Partial<SafeProps>

/**
 * 处理参数。返回可供模板使用的 props 数据
 * @param params 接口参数(通过 zod 校验和转换过之后的)
 */
export function getSafeComponentProps(params: any) {
    const props: SafeComponentProps = {}

    const {
      bgColor = '',
      ratio = 1,
      padding = '0px',
      fontFamily = 'YouSheBiaoTiHei',
      closeColorRandom = false,

      textWrapBgColor = '',
      textWrapShadow = 'none',
      textWrapPadding = '0px',
      textWrapRounded = 'none',

      color = '',
      iconSize = 30,
      fontSize = 30,
      accentColor = '',
      center = '0'
    } = params;
    
    props.fontFamily = fontFamily
    props.ratio = ratio || 1 
    props.fontSize = fontSize || ratio * 30
    props.iconSize = iconSize || fontSize
    // 处理是单色值还是渐变色。已经加 # 
    if (bgColor) {
      const { bgColor: parsedBgColor, bgImage: parsedBgImage } = getParsedBgColor(bgColor)
      console.log(`parsedBgColor`,parsedBgColor, parsedBgImage )
      // 处理背景色
      if (parsedBgColor) {
        props.bgColor = parsedBgColor
      } else if (parsedBgImage) {
        props.bgImage = parsedBgImage
      }
    }
    

    // 处理文本颜色为数组（支持每行不同颜色）
    if (color) {
      props.color = color.split(',')
    }

    // 处理强调色为数组
    if (accentColor) {
      props.accentColor = accentColor.split(',')
    }

    // 每行文本是左对齐0、居中1、两头2、自适应3
    props.center = center.split(',');
    props.padding = padding;

    // 内容区域配置
    // 内容区域背景色 只支持单一色，可用 rgba 设置透明度
    if (textWrapBgColor) {
      const { bgColor } = getParsedBgColor(textWrapBgColor)
      if (bgColor) {
        props.textWrapBgColor = bgColor
      }
    }
    props.textWrapShadow = textWrapShadow
    props.textWrapPadding = textWrapPadding
    props.textWrapRounded = textWrapRounded

    // 随机颜色设置 指定颜色优先
    if (!closeColorRandom) {
      console.log(` 开始设置随机颜色 ...`, )
      const bgColors = randomGradientColors('adjacent')
      const { bgColor, bgImage } = getParsedBgColor(bgColors.join('-'))
      if (!props.bgColor && bgColor) {
        props.bgColor = bgColor;
      } 
      
      if (!props.bgColor && !props.bgImage && bgImage) {
        props.bgImage = bgImage;
      }
      
      props.color = props.color || [getGradientTextColor(bgColors)]
      props.accentColor = props.accentColor || [randomBrightHexColor()]
    }
    return props

}


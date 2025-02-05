uniform sampler2D uBlurTex;
uniform float uMixFactor;
uniform float uBlurPow;
uniform float uBasePow;

// UFSH 2024 Tower of Fantasy share
/* 
Reference：
  https://zhuanlan.zhihu.com/p/675826591
  https://media.colorfulpalette.co.jp/n/n51bf8818b89d
  https://www.pixiv.net/artworks/10325142

*/
 void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor)
    { 

      vec4 blurColor = texture2D(uBlurTex, uv);  
      vec4 baseColor = texture2D(inputBuffer, uv);  

      /* 
      Screen mix
      */
     #ifdef MODE_SCREENMIX

      float mixFactor = uMixFactor; 
  
      vec3 screenColor = 1.0 - (1.0 - baseColor.rgb) * (1.0 - blurColor.rgb);  
  
      vec3 resultColor = mix(baseColor.rgb, screenColor, mixFactor);  
  
      outputColor = vec4(resultColor, baseColor.a); 
  
      #endif

      #ifdef MODE_MAXBLEND

      vec3 mulBlurColor = pow(blurColor.rgb, vec3(uBlurPow));
      vec3 mulColor = pow(baseColor.rgb, vec3(uBasePow));

      vec3 screenColor = mulColor.rgb + mulBlurColor - mulBlurColor * mulColor.rgb;

      // vec3 screenColor = 1.0 - (1.0 - mulColor.rgb) * (1.0 - mulBlurColor.rgb);

      vec3 finalColor = max(baseColor.rgb, screenColor);

      outputColor = vec4(finalColor, baseColor.a);

      #endif

    }
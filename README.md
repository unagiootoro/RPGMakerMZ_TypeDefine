# 概要
本プロジェクトではRPGツクールMZの型定義ファイルを公開しています。

# 使い方
Node.jsでgenerate-typedefine.jsを実行するとTypeScriptによる型定義ファイルの生成を行い、
それを「rmmz-typedefine」ディレクトリに出力します。
```
node ./generate-typedefine.js
```

# プロジェクトの方針
- 本プロジェクトではなるべく型定義の正確性を確保するため、ツクールMZのコアスクリプトをTypeScript化し、それを元に型定義ファイルを生成します。

- コアスクリプトの処理はES6 class化対応を除いてなるべく変更がないようにしています。ただし、やむを得ない場合に限りコアスクリプトの改変を行っています。

- 現時点でのコアスクリプトのベースはv1.5.0です。

- コアスクリプトの定義名lib.d.tsなどで定義されている定義名と重複する場合、コアスクリプトの定義名を変更しています。

# ライセンス
本プロジェクトの成果物はRPGツクールMZのコアスクリプトに対する改変素材として扱います。<br>
https://tkool.jp/support/

上記に加え、以下の条件の下で本プロジェクトの成果物を利用することが可能です。

- 本プロジェクトの成果物を使用してプラグインを制作した場合、
その旨をプラグインの@helpに記載する必要があります。
記載に当たっては必ず本プロジェクトのURLを含めるようにしてください。<br>
※ 記載例<br>
本プラグインは開発に当たって以下の型定義を使用しています。<br>
https://github.com/unagiootoro/RPGMakerMZ_TypeDefine

- 本プロジェクトの成果物は改変の有無を問わず再配布が可能です。

# クレジット
【制作ツール】<br>
RPGツクールMZ<br>
©2020 KADOKAWA CORPORATION./YOJI OJIMA

---
title: 安全测试工具
description: 安全测试工具清单：27 款主流工具——渗透五件套、Web 漏洞扫描、目录 Fuzz、主机与代码安全、移动与专项五组，每个工具独立一页。
---

# 安全测试工具（已收录 27 个）

> 工具整理自「测试开发技术」公众号文章《2026 年安全测试工具大全，15 款主流工具一次看懂》（01-15，序号有调整），并按检索补充了 12 款常用工具（gobuster、OpenVAS、Trivy、Hydra、MobSF、Frida、SonarQube、CodeQL、Dependency-Check、Amass、hashcat、Ghidra）。安全工具的更新换代很慢，**经典永远是经典**——这份清单一大半都是活了十年以上的老面孔。2026 年真正变的东西不在工具名单上，在玩法上：DevSecOps 把扫描器卷进了流水线，Nuclei 的模板库成了漏洞情报的半壁江山。

**新手路线**：没有所谓的新手全家桶，只有新手路线——Nmap 看资产，Burp 手工测，ZAP 自动扫，这条主线先跑通，再按需加 sqlmap、ffuf 这些专项兵器，别一上来就装满一个 Kali。**左移是这十年的主线**：Semgrep 卡代码，Snyk 卡依赖，ZAP 卡部署——安全测试正在从上线后的体检变成流水线里的门禁，测试工程师想往安全转，切入口就在这些工具的自动化集成上。

> ⚠️ **边界声明**：本清单仅用于授权测试和安全研究。授权范围之内是测试，范围之外是犯罪——刑法的红线比工具的学习曲线陡多了。

## 一、渗透测试五件套

| 序号 | 工具 | 一句话点评 |
| --- | --- | --- |
| 01 | [Burp Suite](./01-burp-suite.md) | Web 安全绝对标配，拦截代理加 Scanner 加 Intruder |
| 02 | [OWASP ZAP](./02-zap.md) | Burp 最有名的免费平替，DevSecOps 引用量第一 |
| 03 | [Nmap](./03-nmap.md) | 1997 年活到现在的网络探测之王 |
| 04 | [Metasploit](./04-metasploit.md) | 全球最大 Payload 库，红队军火库底座 |
| 05 | [Wireshark](./05-wireshark.md) | 协议级抓包分析的天花板，二十年无挑战者 |

## 二、Web 漏洞扫描与利用

| 序号 | 工具 | 一句话点评 |
| --- | --- | --- |
| 06 | [sqlmap](./06-sqlmap.md) | SQL 注入自动化检测与利用神器，一条龙到拖库 |
| 07 | [Nuclei](./07-nuclei.md) | 模板化扫描器当红明星，社区模板库上万 |
| 08 | [Acunetix（AWVS）](./08-acunetix.md) | Invicti 商业扫描器，误报控制标杆 |
| 09 | [Xray](./09-xray.md) | 长亭出品，被动代理扫描，国产口碑 |

## 三、目录探测与 Fuzz

| 序号 | 工具 | 一句话点评 |
| --- | --- | --- |
| 10 | [ffuf](./10-ffuf.md) | Go 快速 Fuzz，目录暴破参数 Fuzz 一通百通 |
| 11 | [Nikto](./11-nikto.md) | 二十年老牌 Web 服务器扫描器，资产初筛敲门砖 |
| 12 | [dirsearch](./12-dirsearch.md) | Python 目录暴破，字典管理友好 |
| 13 | [gobuster](./13-gobuster.md) | Go 高性能枚举，目录/DNS/VHost/S3 多模式 |

## 四、主机与代码安全

| 序号 | 工具 | 一句话点评 |
| --- | --- | --- |
| 14 | [Nessus](./14-nessus.md) | Tenable 主机漏洞扫描老钱，插件覆盖第一 |
| 15 | [OpenVAS](./15-openvas.md) | Nessus 的开源替代（Greenbone 体系） |
| 16 | [Semgrep](./16-semgrep.md) | SAST 新贵，规则即代码，快进 CI 卡点 |
| 17 | [SonarQube](./17-sonarqube.md) | 代码质量与安全扫描的老牌平台 |
| 18 | [CodeQL](./18-codeql.md) | GitHub 出品，代码当数据库查询的 SAST |
| 19 | [Snyk](./19-snyk.md) | 供应链安全代表，SCA 起家容器 IaC 全管 |
| 20 | [Dependency-Check](./20-dependency-check.md) | OWASP 开源 SCA，依赖漏洞扫描免费方案 |
| 21 | [Trivy](./21-trivy.md) | 容器镜像/依赖/IaC 一体化扫描，CI 集成方便 |

## 五、移动与专项

| 序号 | 工具 | 一句话点评 |
| --- | --- | --- |
| 22 | [MobSF](./22-mobsf.md) | 一站式移动安全（静态 + 动态），唯一免费全能型 |
| 23 | [Frida](./23-frida.md) | 动态插桩框架，移动 App 安全测试标配 |
| 24 | [Hydra](./24-hydra.md) | 弱口令暴破经典，数十种协议 |
| 25 | [Amass](./25-amass.md) | OWASP 子域名与攻击面测绘 |
| 26 | [hashcat](./26-hashcat.md) | GPU 密码破解之王 |
| 27 | [Ghidra](./27-ghidra.md) | NSA 开源逆向工程套件 |

## 数据核验说明

- GitHub 仓库地址、star 数、开源协议经 gh CLI 实时核验，核验时间 **2026-10**；star 数随时间变化，以仓库页面为准。
- Dependency-Check 仓库已迁移为 `dependency-check/DependencyCheck`（原 jeremylong 名下）；Ghidra 仓库为 `NationalSecurityAgency/ghidra`；OpenVAS 现属 Greenbone 体系（主扫描器仓库 `greenbone/openvas-scanner`）；Nikto 仓库为 `sullo/nikto`。
- 协议提示：k6 同理，本分类内 Hydra 为 AGPL-3.0、MobSF 为 GPL-3.0、OpenVAS 为 GPL-2.0，商用集成需评估；Xray 社区版免费但非标准开源协议。
- 无配图说明：Acunetix（Invicti）官网为 JS 渲染、CodeQL 图片服务受限，暂缺配图。

欢迎推荐遗漏的工具，参见[贡献指南](/about/contributing.html)。

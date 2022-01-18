# [0.5.0](https://github.com/lidofinance/easy-track-ui/compare/0.4.0...0.5.0) (2022-01-18)


### Bug Fixes

* **security:** disable frameguard ([f57cd77](https://github.com/lidofinance/easy-track-ui/commit/f57cd77ed0b43ad17ac821eda11ff31979e441ab))


### Features

* **metrics:** add a chainId label for requests metrics ([06ec3d4](https://github.com/lidofinance/easy-track-ui/commit/06ec3d42d1f3cb944e834771d12c1ead12b80550))



# [0.4.0](https://github.com/lidofinance/easy-track-ui/compare/0.3.0...0.4.0) (2022-01-17)


### Bug Fixes

* chain types ([8bfd987](https://github.com/lidofinance/easy-track-ui/commit/8bfd987b8da82e91a147f7199c39473c7b50c479))
* content security policy workaround ([6e48167](https://github.com/lidofinance/easy-track-ui/commit/6e481672b2c0b001c0c97b453b5873668bbe7d1e))
* custom network crash ([12ba402](https://github.com/lidofinance/easy-track-ui/commit/12ba4028100c03930b57839e0a7e4fd045578836))
* disabled ledger connector if it's not supported ([2d028a1](https://github.com/lidofinance/easy-track-ui/commit/2d028a1bf3cdea965ec0cfd578dd2554c11c181b))
* enact gas limit ([3a3d7b1](https://github.com/lidofinance/easy-track-ui/commit/3a3d7b11f14ba00f710a4cddfa5328774d091d3a))
* hooks usage ([4d95872](https://github.com/lidofinance/easy-track-ui/commit/4d958721d8a7e582af1534b9ffcebb99b647f37a))
* **logging:** change rpc call stage ([50f91fb](https://github.com/lidofinance/easy-track-ui/commit/50f91fb0d2d59f7a55a734eb0512a50fcf8bd2e2))
* **logging:** do no prettify logs for parsing ([269d31b](https://github.com/lidofinance/easy-track-ui/commit/269d31bef8e911b326995bae23d4fdf349b9d00e))
* **logging:** sanitize all hexes ([2848149](https://github.com/lidofinance/easy-track-ui/commit/2848149aadef7b39b5f6bbab46b1f507d6da64ec))
* **logging:** tweak format for consistency ([af93221](https://github.com/lidofinance/easy-track-ui/commit/af932214221aa7d2d0a42e4392e5e4c62d6b5ec3))
* **logging:** use a deep copy for logging ([2232993](https://github.com/lidofinance/easy-track-ui/commit/2232993d4cbfbca3d45e14add3deb121a633e7ca))
* **logging:** use json logger for production ([5b10315](https://github.com/lidofinance/easy-track-ui/commit/5b10315d90265fce53dcab2de88ce101ac5fc6eb))
* metamask in ff ([d79d69d](https://github.com/lidofinance/easy-track-ui/commit/d79d69db20eb794fc19d6817508795f6470d2d8e))
* **metrics:** clear metrics register in dev mode ([e3288de](https://github.com/lidofinance/easy-track-ui/commit/e3288de84e7a97917e622b9f216d27265f7ac197))
* **metrics:** disable metrics for development ([3bff85a](https://github.com/lidofinance/easy-track-ui/commit/3bff85ae7d754668674310d63f2be36d3d1a4733))
* **metrics:** fix build info json ([6ffc3bf](https://github.com/lidofinance/easy-track-ui/commit/6ffc3bf8e96ecfdc246aa57722534d20f5cab5f6))
* **metrics:** fix metrics collection ([ccd860f](https://github.com/lidofinance/easy-track-ui/commit/ccd860f1b90bd4bb11b1f67f59808fc4a2be1278))
* **metrics:** fix metrics register being cleared ([743cb8e](https://github.com/lidofinance/easy-track-ui/commit/743cb8e9c788a4f2e78b7f80310142782014e95d))
* **metrics:** make prometheus response time buckets more granular ([a25301b](https://github.com/lidofinance/easy-track-ui/commit/a25301b4e514df2e87e0b8a57799cf6f7a6168df))
* **metrics:** remove unnecessary code ([0eaf55d](https://github.com/lidofinance/easy-track-ui/commit/0eaf55dd7438ed47c99eb075d4f8e8e22e94c9e8))
* **metrics:** rename metrics according to best practices ([57542b2](https://github.com/lidofinance/easy-track-ui/commit/57542b2fc7fd962903c2108297ae3141852eb454))
* network switching ([f84630a](https://github.com/lidofinance/easy-track-ui/commit/f84630adf7a63dd9cd79b52428ba3c1fca799062))
* objections percents formatting ([359ed41](https://github.com/lidofinance/easy-track-ui/commit/359ed4177c10ad303e12fa7975f694ff6fc0accf))
* proper walletconnect versions fixation ([c281a64](https://github.com/lidofinance/easy-track-ui/commit/c281a644a982a58230193a4973b4ae141cfbb935))
* remove address badge margins ([7403b62](https://github.com/lidofinance/easy-track-ui/commit/7403b62492598936b7cc38cd642e0684ae7e21cf))
* remove excessive auto connect hook call ([70f410a](https://github.com/lidofinance/easy-track-ui/commit/70f410afb7bb3eee59c7317a12b4d8354fea3637))
* remove not buttons that not working ([fc87af3](https://github.com/lidofinance/easy-track-ui/commit/fc87af31757a11bdfb13f4cca4a5ae5e822b02b5))
* resolve governance symbol with rpc not web3 for unauthorized user ([963c987](https://github.com/lidofinance/easy-track-ui/commit/963c9879aeb4220ba8a589d28d9998ed7ebaa161))
* resolve governance symbol with rpc not web3 for unauthorized user ([a3c04f0](https://github.com/lidofinance/easy-track-ui/commit/a3c04f0044ff1b9845b401f667a84f82b2f6908d))
* **security:** add CSP headers ([7727d90](https://github.com/lidofinance/easy-track-ui/commit/7727d90000370f7f62dfe46e873e2ffa7690eb43))
* **security:** add walletconnect uris to csp ([70291cd](https://github.com/lidofinance/easy-track-ui/commit/70291cd935cdaee110c04b5614c37ed17df787e4))
* **security:** bring back commented out font source and subgraph ([4f2bd97](https://github.com/lidofinance/easy-track-ui/commit/4f2bd972e9563e5f88b89b355796ea55739960ce))
* **security:** fix csp default-src for firefox ([8243649](https://github.com/lidofinance/easy-track-ui/commit/824364979eb39f9fd736405a18c7f6e9d65fb032))
* **security:** format trusted hosts for csp ([11a403b](https://github.com/lidofinance/easy-track-ui/commit/11a403b1adaac685c42c122b64befa975bd0a65d))
* **security:** install next-secure-headers as dep ([13afe7c](https://github.com/lidofinance/easy-track-ui/commit/13afe7c5818e402d7e5781038e3ed64d7da9cd83))
* **security:** remove csp from config ([d88fa75](https://github.com/lidofinance/easy-track-ui/commit/d88fa750e2e679bd4f1aa53331c50e43ddd3bbb4))
* **security:** remove headers for now ([2fe3e22](https://github.com/lidofinance/easy-track-ui/commit/2fe3e2291675cc06aa1c57868d1270da4a7260f3))
* transaction toast message ([f196ec7](https://github.com/lidofinance/easy-track-ui/commit/f196ec73d0ca713510bec9028345efd57e30747c))
* turn off csp for development ([cf6669b](https://github.com/lidofinance/easy-track-ui/commit/cf6669bc51464a9ae9dafd8d5ade952fb1b3af01))
* unsupported chain error ([8a358f4](https://github.com/lidofinance/easy-track-ui/commit/8a358f4e5126be19e0847a780630be79fd60ac2a))
* very crutchy wallet connect dependencies fixation for contract reading reverted bugfix ([6ca9c70](https://github.com/lidofinance/easy-track-ui/commit/6ca9c706ee2bdfbe83843010e617e3baa69f2c2d))
* wallet modal unsupported chain crash ([747f3d0](https://github.com/lidofinance/easy-track-ui/commit/747f3d0b210ad1219933d12e06af38224a1388e3))


### Features

* add ledger support ([1bc437f](https://github.com/lidofinance/easy-track-ui/commit/1bc437fad3edb0b1895501ba1327248922dcf604))
* **logging:** log rpc requests ([bc082e9](https://github.com/lidofinance/easy-track-ui/commit/bc082e918829e32de3a6be3968cf1f1559e8fcf1))
* **metrics:** add chain config to metrics ([1e7c85e](https://github.com/lidofinance/easy-track-ui/commit/1e7c85ed3fcaf8a9bd0fa4967d036ed67aa743f6))
* **metrics:** add contract config ([cead7d0](https://github.com/lidofinance/easy-track-ui/commit/cead7d0ecd8fd635532219d9c93c1fd0f730f6d0))
* **metrics:** add contract info ([7cbec2b](https://github.com/lidofinance/easy-track-ui/commit/7cbec2b27fef081a0bc4a029118f2a7883bb8f2f))
* **metrics:** collect contract config for all supported chains ([e2e280d](https://github.com/lidofinance/easy-track-ui/commit/e2e280d192ed3948de778cf4d1b611c40c171b16))
* **metrics:** collect ethereum response times separately ([6e816bd](https://github.com/lidofinance/easy-track-ui/commit/6e816bd3cff5f614bd5ad36ecc3af202242d8163))
* **metrics:** collect rpc requests ([88ef2ea](https://github.com/lidofinance/easy-track-ui/commit/88ef2ea5775495f44b2ba9e4b72ab17830a8ae60))
* **metrics:** measure real ethereum requests ([5c0115f](https://github.com/lidofinance/easy-track-ui/commit/5c0115fa573acaf3d5b624caa218987952e1eb69))
* **security:** add csp report only mode ([8a09ff2](https://github.com/lidofinance/easy-track-ui/commit/8a09ff2aae6cf0de68d9f1dc678baff398d9237d))
* **security:** add csr report only flag ([6e3cc4d](https://github.com/lidofinance/easy-track-ui/commit/6e3cc4d59095844041812538fffc85a18d64492e))
* **security:** add variuos security headers ([03974b7](https://github.com/lidofinance/easy-track-ui/commit/03974b7b6b1966ac2c83c0acf332dc05b6b43122))
* **security:** create csp report api route ([574e3cc](https://github.com/lidofinance/easy-track-ui/commit/574e3cc677fb33bbddf6a0c739eb78315771bc63))
* **security:** enable CSP blocking ([5c966cd](https://github.com/lidofinance/easy-track-ui/commit/5c966cd81d50563369d980e0a55e3ad466aeafbb))
* **security:** tighten csp ([ca2a59e](https://github.com/lidofinance/easy-track-ui/commit/ca2a59e2c1afacf3185aad09eca90c1fb40ab34d))
* **security:** use HOC for csp headers ([a578749](https://github.com/lidofinance/easy-track-ui/commit/a578749df6148ec3b2e7c0bccc55b7f11b3d8b54))



# [0.3.0](https://github.com/lidofinance/easy-track-ui/compare/0.2.1...0.3.0) (2021-12-03)


### Bug Fixes

* disable metamask button when no extension installed ([85cda9d](https://github.com/lidofinance/easy-track-ui/commit/85cda9d01ad9ddad5dd55dca041805c65893695d))
* gnosis link ([d09b4e2](https://github.com/lidofinance/easy-track-ui/commit/d09b4e2a53390e69b0442cecc1bf5a93754d0ab7))
* **logging:** fix ens name regex ([833aff9](https://github.com/lidofinance/easy-track-ui/commit/833aff9726de2d10d90a44c8d19c22f49b069a65))
* metamask connect disabling ([c8d176b](https://github.com/lidofinance/easy-track-ui/commit/c8d176b6994ffb4b603cfac20f1a0236cea2c620))
* **metrics:** clear metrics on request ([fcc9f7c](https://github.com/lidofinance/easy-track-ui/commit/fcc9f7c9ed372928fa36088ffbd2d6fa3113068b))
* show network switcher only for metamask extension ([27e23f6](https://github.com/lidofinance/easy-track-ui/commit/27e23f6e8705326a4b8fec957995c11b8f8ce7fb))


### Features

* **logging:** sanitize logs ([745cf2e](https://github.com/lidofinance/easy-track-ui/commit/745cf2ed1c75a27e0257a7617eefd5d8665bc688))
* **metrics:** add build_info and ethereum timing to metrics ([f19188c](https://github.com/lidofinance/easy-track-ui/commit/f19188c31f2fdca3a5f7a508df829bbe73907b0a))



# [0.2.0](https://github.com/lidofinance/easy-track-ui/compare/616d7f7fe3a92182a0087512f6811c4e71395d93...0.2.0) (2021-11-26)


### Bug Fixes

* build errors ([5275731](https://github.com/lidofinance/easy-track-ui/commit/52757314899990d394a2a24cc7cadbcb0b034ace))
* disable conflicting eslint plugin ([ed6cf27](https://github.com/lidofinance/easy-track-ui/commit/ed6cf27f65da3e6758b61ad3efc21a98effff893))
* errors being logged without message ([bf8e729](https://github.com/lidofinance/easy-track-ui/commit/bf8e729461ae2294b8dd7f45822d6aa3ed359398))
* fix yarn lock ([152ab63](https://github.com/lidofinance/easy-track-ui/commit/152ab637989e876bf20c89d543755cb788ba8fa0))
* getServerSideProps ([b85f0d8](https://github.com/lidofinance/easy-track-ui/commit/b85f0d845e71a0bb947ae42914e848028c89d809))
* hide motion actions after enact transaction confirmed ([13fc21e](https://github.com/lidofinance/easy-track-ui/commit/13fc21e1b5df5abb423e430df46c6c5920732e43))
* **logging:** use console for logging ([50db838](https://github.com/lidofinance/easy-track-ui/commit/50db838309156e4ae9544cee35c3a798274a0c0c))
* missed dependency ([325f5df](https://github.com/lidofinance/easy-track-ui/commit/325f5dffcf7f9117eaf777ff7391c6628aba0e72))
* motion created event parsing ([a2fb954](https://github.com/lidofinance/easy-track-ui/commit/a2fb95412cd4aee597098e3272362617475d4213))
* rename health check endpoint ([e953f03](https://github.com/lidofinance/easy-track-ui/commit/e953f035beb509d6de4e297efd92516dc4183c19))
* update gitignore ([bf0cbda](https://github.com/lidofinance/easy-track-ui/commit/bf0cbda0b5e10f607f73fd2a86b22d6479fcb2fb))
* use function decl for consistency ([1fd9111](https://github.com/lidofinance/easy-track-ui/commit/1fd9111d58ee84c1d4dc6a1134c573f69bcccc93))
* use healtcheck endpoint instead of root page (in Dockerfile) ([0dc39a2](https://github.com/lidofinance/easy-track-ui/commit/0dc39a20baf82fbebd6890d762a54e24e52d0a17))


### Features

* basic health check endpoint ([01c6718](https://github.com/lidofinance/easy-track-ui/commit/01c671891334e56814c15f6baf3e19c17c216322))
* display essential info in custom meta tags ([c70bd67](https://github.com/lidofinance/easy-track-ui/commit/c70bd6783256580bcd66d3947bb676677179932b))
* do not output logs to file ([b6bf085](https://github.com/lidofinance/easy-track-ui/commit/b6bf085db59f9f4387d2f9ad3abe654bd1688272))
* Dockerfile lint ([107b330](https://github.com/lidofinance/easy-track-ui/commit/107b330d174995b9ae22fc3409ab1b87423882d6))
* favicon ([80cc968](https://github.com/lidofinance/easy-track-ui/commit/80cc96848d83f7dca76f0a7fdc1fea37f08d0192))
* log api errors to output in json ([2846c89](https://github.com/lidofinance/easy-track-ui/commit/2846c890f0c1ec90586ed5d4da5440a745c9ade2))
* **logging:** include timestamps in logger ([531bc00](https://github.com/lidofinance/easy-track-ui/commit/531bc004bc8dddc0539e1eccc414f6abd04a5223))
* prometheus default metrics endpoint ([616d7f7](https://github.com/lidofinance/easy-track-ui/commit/616d7f7fe3a92182a0087512f6811c4e71395d93))
* security headers ([63c20da](https://github.com/lidofinance/easy-track-ui/commit/63c20da52beba788a0f81c9cbf20c87d7eceb3df))
* store logs in file ([217d505](https://github.com/lidofinance/easy-track-ui/commit/217d505e7954c66a55cfb6395ec6f9d9827ab16f))




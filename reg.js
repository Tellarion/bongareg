/* shit script */
/* tellarion.dev */

const puppeteer = require('puppeteer')

const axios = require('axios')

const fs = require('fs')

const { generateFromEmail, generateUsername } = require("unique-username-generator")

var html2json = require('html2json').html2json

const preparePageForTests = async (page) => {

    const userAgent = `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36`
    await page.setUserAgent(userAgent)

    await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'webdriver', {
            get: () => false,
        });
    });

    await page.evaluateOnNewDocument(() => {
        window.navigator.chrome = {
            runtime: {},

        };
    });

    await page.evaluateOnNewDocument(() => {
        const originalQuery = window.navigator.permissions.query;
        return window.navigator.permissions.query = (parameters) => (
            parameters.name === 'notifications' ?
                Promise.resolve({ state: Notification.permission }) :
                originalQuery(parameters)
        );
    });

    await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'plugins', {
            get: () => [1, 2, 3, 4, 5],
        });
    });

    await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'languages', {
            get: () => ['en-US', 'en'],
        });
    });
}

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getHTML(code) {
    return new Promise(resolve => {
      resolve(html2json(code))
    })
}

function randomInteger(min, max) {
    let rand = min + Math.random() * (max - min);
    return Math.round(rand);
}

async function startFlood() {

    // https://changeip.mobileproxy.space/

    console.log('start and wait')

    var bongaLink = `https://bongacams.com`

    axios.get('https://proxy.tellarion.dev')
    .then(async function (response) {
        // handle success
        let getData = response.data
        if(getData.code == 200) {
            let getIP = getData.new_ip
            console.log(`IP: ${getIP}`)
            fs.appendFile('ipsBanned.txt', `${getIP}\n`, function (err) {
                if (err) throw err;
                console.log('Save IP!');
            })
            var modelName = ``
            await sleep(3000)
            console.log('Wait proxy loading...')
            const browser = await puppeteer.launch({
                headless: false,
                defaultViewport: null,
                args: [ '--proxy-server=http://tellarion.dev:1488' ],
            });
            /* linux save */
            // '--no-sandbox', 
            // ignoreDefaultArgs: ['--disable-extensions']
            /* done */
            const page = await browser.newPage()
            const username = '';
            const password = '';
            await page.authenticate({ username, password })
            await page.setDefaultNavigationTimeout(300000)
            await preparePageForTests(page)
            try {
                await page.goto(bongaLink)
            } catch(error) {
                console.log('BongaCams недоступен')
                await sleep(5000)
                console.log('Спим 5 сек')
                browser.close()
                setTimeout(startFlood(), 1000)
                return Promise.reject(true)
            }
            await sleep(2000)
            console.log('поспали')
            try {
                await page.click('#warning_popup > div > div > div.inner > div.button_block > a.mls_btn.bt30_green.agree.wl_green_btn.js-close_warning')
            } catch(error) {
                await page.click('.wpp_actions a')
            }
            console.log('закрыли модалку')
            await sleep(5000)
            await page.waitForSelector('#btn_signup')
            await page.click('#btn_signup')
            console.log('открыли форму регистрации')

            await sleep(2000)

            console.log('находим форму регистрации')

            try {
                await page.waitForSelector('.fp_content div')
            } catch(error) {
                console.log('Баг сайта')
                await sleep(5000)
                console.log('Спим 5 сек')
                browser.close()
                setTimeout(startFlood(), 1000)
                return Promise.reject(true)
            }
            let html = await page.$eval('.fp_content div', e => e.innerHTML)
            let convHTML = await getHTML(html)
            let checkTypeModalRegistation = convHTML.child[1].attr

            let regType = 0

            try {

                if(checkTypeModalRegistation.class.findIndex(item => item == 'reactions_join') != -1) {
                    console.log('баба с монетками')
                }
                if(checkTypeModalRegistation.class.findIndex(item => item == 'horizont_green2') != -1) {
                    console.log('стандартная форма реги')
                }
                if(checkTypeModalRegistation.class.findIndex(item => item == 'girls_blue') != -1) {
                    console.log('две бабы секс')
                }
                if(checkTypeModalRegistation.class.findIndex(item => item == 'boom') != -1) {
                    regType = 1
                    console.log('зеленая баба')
                }

            } catch(error) {
                console.log('хуевое окно')
                browser.close()
                await sleep(10000)
                setTimeout(startFlood(), 1000)
                return Promise.reject(true)
            }

            let usernameReg = generateUsername("", 2, 19)

            try {
                await page.$eval('input[id=user_member_username]', (el, usernameReg) => {
                    el.value = usernameReg
                }, usernameReg)

                if(regType == 1) {
                    page.keyboard.press('Enter')
                }
            } catch(error) {
                console.log('bug 1')
                browser.close()
                setTimeout(startFlood(), 1000)
                return Promise.reject(true)
            }
            
            await sleep(1000)

            let passwordReg = `tellarion${randomInteger(999999, 99999999)}tellarion`

            await page.$eval('input[id=user_member_password]', (el, passwordReg) => {
                el.value = passwordReg
            }, passwordReg)

            await sleep(1000)

            await page.click('#user_member_terms_of_use')

            await sleep(1000)

            await page.click('.join_submit')

            await sleep(10000)

            console.log('зарегистрировались')

            console.log('работаем с почтой')

            /* резерв по активации */
            
            /*

            const page2 = await browser.newPage()

            await page2.setDefaultNavigationTimeout(999999999)

            page2.goto('https://www.emailnator.com/')

            console.log('продолжить тут')

            //
            await sleep(2000)

            // тест
            

            await page2.waitForSelector('.card-body')

            await sleep(3000)
            let inputEmail = await page2.$('.card-body input')
            await inputEmail.focus()

            await page2.keyboard.down('ControlLeft')
            await page2.keyboard.press('KeyA')
            await page2.keyboard.press('KeyC');
            await page2.keyboard.up('ControlLeft')

            await sleep(1000)
            
            await page2.click('button[name=goBtn]')

            await sleep(1000)

            await page.bringToFront()

            await sleep(1000)

            let input = await page.$('.bcf_input_block input')
            await input.focus()
            await page.keyboard.down('Control')
            await page.keyboard.press('V')
            await page.keyboard.up('Control')

            await page.click('.ace_content button')

            await sleep(2000)

            await page2.bringToFront()

            await sleep(7000)

            await page2.click('button[name=reload]')

            await sleep(2000)

            try {

            await page2.click('#root > div > section > div > div > div.mb-3.col-lg-6.col-sm-12 > div > div.card-body > div:nth-child(3) > div > table > tbody > tr:nth-child(2) > td > a')

            await sleep(3000)

            await page2.click('#root > div > section > div > div > div.mb-3.col-lg-6.col-sm-12 > div > div > div.card > div > div > table:nth-child(10) > tbody > tr > td:nth-child(2) > table > tbody > tr > td > table:nth-child(3) > tbody > tr > td.outer > div > div.outer > table > tbody > tr > td > table > tbody > tr > td:nth-child(2) > table > tbody > tr > td > div > a')

            } catch(error) {
                await page2.click('button[name=reload]')

                await sleep(2000)

                await page2.click('#root > div > section > div > div > div.mb-3.col-lg-6.col-sm-12 > div > div.card-body > div:nth-child(3) > div > table > tbody > tr:nth-child(2) > td > a')

                await sleep(3000)

                await page2.click('#root > div > section > div > div > div.mb-3.col-lg-6.col-sm-12 > div > div > div.card > div > div > table:nth-child(10) > tbody > tr > td:nth-child(2) > table > tbody > tr > td > table:nth-child(3) > tbody > tr > td.outer > div > div.outer > table > tbody > tr > td > table > tbody > tr > td:nth-child(2) > table > tbody > tr > td > div > a')
            }
            */


            const page2 = await browser.newPage()

            await page2.setDefaultNavigationTimeout(999999999)

            try {

            page2.goto('https://temp-mailbox.com/')

            } catch(error) {
                console.log('сайт с почтой недоступен')
                browser.close()
                setTimeout(startFlood(), 1000)
                return Promise.reject(true)

            }

            //
            await sleep(2000)

            // тест

            try {

            await page2.waitForSelector('.custom-email')

            await sleep(3000)
            await page2.click('.custom-email button')

            await sleep(1000)

            await page.bringToFront()

            await sleep(3000)

            let input = await page.$('.bcf_input_block input')
            await input.focus()
            await page.keyboard.down('Control')
            await page.keyboard.press('V')
            await page.keyboard.up('Control')

            await page.click('.ace_content button')

            await sleep(2000)

            await page2.bringToFront()

            await page2.waitForSelector('.message-item')
            await page2.click('.message-item')

            await sleep(3000)
            
            } catch(error) {
                console.log('bug 1')
                browser.close()
                setTimeout(startFlood(), 1000)
                return Promise.reject(true)
            }

            let card = await page2.$eval('.card-body', e => e.innerHTML)

            let parsePage = await getHTML(card)

            let getURLAccept = parsePage.child[5].child[0].attr.src

            // тут остановился

            // url

            const page3 = await browser.newPage()

            await page3.setDefaultNavigationTimeout(30000)

            page3.goto(getURLAccept)

            await page3.waitForSelector('table')

            console.log('10 sec')

            await sleep(10000)

            await page3.click('body > table:nth-child(2) > tbody > tr > td:nth-child(2) > table > tbody > tr > td > table:nth-child(3) > tbody > tr > td.outer > div > div.outer > table > tbody > tr > td > table > tbody > tr > td:nth-child(2) > table > tbody > tr > td > div > a')

            // here try

            await sleep(3000)

            var statusEnd = `Unknown`

            try {

                await page3.waitForSelector('.cb_text')

                let status = await page3.$eval('.cb_text', e => e.innerHTML)

                let parseStatus = await getHTML(status)

                console.log(parseStatus.child[3].child)

                console.log('тут потом')

                statusEnd = parseStatus.child[3].child[0].text
                //await page3.close()

            } catch(error) {
                console.log(error)
            }

            if(statusEnd.includes('Ой!') || statusEnd.includes('Oops!') || statusEnd == 'Unknown') {
                statusEnd = `0 tokens`
            } else {
                statusEnd = `10 tokens`
            }

            fs.appendFile('accounts.txt', `${getIP}:${usernameReg}:${passwordReg}:${statusEnd}\n`, function (err) {
                if (err) throw err;
                console.log('Saved!');
            })
            

            // возвращаемся на первую

            await page.bringToFront()

            await page.goto(`${bongaLink}/${modelName}`)

            await sleep(3000)

            let randomSmileChat = [':hi', ':big_cock', ':smile', ':love', ':hot']

            if(statusEnd.includes('Ой!') || statusEnd.includes('Oops!') || statusEnd == 'Unknown') {
                try {
                    let getRandomSmile = randomSmileChat[randomInteger(0, 4)]
                    await page.waitForSelector('.bc_d_contents button')
                    page.click('.bc_d_contents button')
                    await sleep(2000)
                    page.click(`[token="${getRandomSmile}"]`)
                    await sleep(1000)
                    page.keyboard.press('Enter')
                    
                } catch(error2) {
                    console.log('chat error')
                }
            } else {

                await page.waitForSelector('#bTip')

                await page.click('#bTip')

                await sleep(3000)

                try {

                    page.keyboard.press('Backspace')
                    await sleep(1000)
                    page.keyboard.press('Backspace')
                    await sleep(1000)
                    page.keyboard.press('1')
                    await sleep(1000)
                    page.keyboard.press('0')
                    await sleep(1000)

                    page.keyboard.press('Enter')

                    await page.click('._px_ button')

                    fs.appendFile('plus.txt', `${getIP}:${usernameReg}:10:${modelName}\n`, function (err) {
                        if (err) throw err;
                    })

                    await sleep(3000)

                } catch(error) {
                    console.log('donate form')
                    console.log(error)
                }

                try {
                    let getRandomSmile = randomSmileChat[randomInteger(0, 4)]
                    await page.waitForSelector('.bc_d_contents button')
                    page.click('.bc_d_contents button')
                    await sleep(2000)
                    page.click(`[token="${getRandomSmile}"]`)
                    page.keyboard.press('Enter')
                    page.keyboard.press('Enter')

                    await sleep(1000)
                    
                } catch(error2) {
                    console.log('chat error')
                }
            }

            console.log('gotovo')
            await sleep(1000)
            browser.close()

            setTimeout(startFlood(), 1000)

            return Promise.resolve(true)

        } else {
            if(response.status == 'err') {
                await sleep(10000)
                setTimeout(startFlood(), 1000)
            }
        }

    })
    .catch(async function (error) {
        console.log('ips get wrong')
        setTimeout(startFlood(), 1000)
    })

}

startFlood()








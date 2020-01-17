from selenium import webdriver
import datetime
driver = webdriver.Chrome('./chromedriver')
driver.implicitly_wait(3)
driver.get('https://news.naver.com/main/read.nhn?mode=LSD&mid=shm&sid1=100&oid=022&aid=0003429358')
driver.implicitly_wait(30)
title = driver.find_element_by_xpath('//*[@id="articleTitle"]')
print(title.text)
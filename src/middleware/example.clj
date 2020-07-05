(ns middleware.example
  (:require [clj-http.client :as http])
  (:import (java.util Date)))

(defn client [request]
  (http/get (:site request) (:options request)))


;(client {:site "http://www.aoeu.com" :options {}})


;; It is standard convention to name middleware wrap-<something>
(defn wrap-no-op
  ;; the wrapping function takes a client function to be used...
  [client-fn]
  ;; ...and returns a function that takes a request...
  (fn [request]
    ;; ...that calls the client function with the request
    (client-fn request)))


(def new-client (wrap-no-op client))

;
;(new-client {:site "http://www.aoeu.com" :options {}})
;(new-client {:site "http://www.aoeu.com" :options {}})
;; modify request
(defn wrap-https
  [client-fn]
  (fn [request]
    (let [site (:site request)
          new-site (.replaceAll site "http:" "https:")
          new-request (assoc request :site new-site)]
      (client-fn new-request))))

(def https-client (wrap-https client))

((wrap-https identity) {:site "http://www.example.com"})

(https-client {:site "http://www.aoeu.com" :options {}})


(defn wrap-add-date
  [client]
  (fn [request]
    (let [response (client request)]
      (assoc response :date (Date.)))))


((wrap-add-date identity) {})

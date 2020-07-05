(ns metabase.query-processor.middleware.mbql-to-native
  "Middleware responsible for converting MBQL queries to native queries (by calling the driver's QP methods)
   so the query can then be executed."
  (:require [clojure.tools.logging :as log]
            [metabase
             [driver :as driver]
             [util :as u]]
            [metabase.query-processor.context :as context]))

(defn- query->native-form
  "Return a `:native` query form for `query`, converting it from MBQL if needed."
  [{query-type :type, :as query}]
  (log/info driver/*driver*)
  (if-not (= :query query-type)
    ;; if query-type is :native, just return native query
    (:native query)
    ;; otherwise translate from mbql to native sql
    (driver/mbql->native driver/*driver* query)))

;; outgoing native query example
;{:query
;         "SELECT \"PUBLIC\".\"PEOPLE\".\"ID\" AS \"ID\", \"PUBLIC\".\"PEOPLE\".\"NAME\" AS \"NAME\", \"PUBLIC\".\"PEOPLE\".\"ADDRESS\" AS \"ADDRESS\", \"PUBLIC\".\"PEOPLE\".\"BIRTH_DATE\" AS \"BIRTH_DATE\", \"PUBLIC\".\"PEOPLE\".\"CITY\" AS \"CITY\", \"PUBLIC\".\"PEOPLE\".\"CREATED_AT\" AS \"CREATED_AT\", \"PUBLIC\".\"PEOPLE\".\"EMAIL\" AS \"EMAIL\", \"PUBLIC\".\"PEOPLE\".\"LATITUDE\" AS \"LATITUDE\", \"PUBLIC\".\"PEOPLE\".\"LONGITUDE\" AS \"LONGITUDE\", \"PUBLIC\".\"PEOPLE\".\"PASSWORD\" AS \"PASSWORD\", \"PUBLIC\".\"PEOPLE\".\"SOURCE\" AS \"SOURCE\", \"PUBLIC\".\"PEOPLE\".\"STATE\" AS \"STATE\", \"PUBLIC\".\"PEOPLE\".\"ZIP\" AS \"ZIP\" FROM \"PUBLIC\".\"PEOPLE\" LIMIT 2000",
; :params nil}


;; incoming query example:
;;
;{:database 1,
; :query
;           {:source-table 3,
;            :fields
;                          [[:field-id 21]
;                           [:field-id 20]
;                           [:field-id 22]
;                           [:datetime-field [:field-id 19] :default]
;                           [:field-id 30]
;                           [:datetime-field [:field-id 26] :default]
;                           [:field-id 25]
;                           [:field-id 18]
;                           [:field-id 23]
;                           [:field-id 29]
;                           [:field-id 24]
;                           [:field-id 28]
;                           [:field-id 27]],
;            :limit 2000},
; :type :query,
; :middleware {:add-default-userland-constraints? true},
; :info
; {:executed-by 1,
;  :context :ad-hoc,
;  :nested? false,
;  :query-hash [-93, 89, -67, 26, 46, 122, -80, -116, 97, 33, -14, 19, 22, -96, 7, -44, 101, -5, -76, -37, 121, -71, 74, -15, -100, 77, 54, 46, -22, 124, 35, -122]},
; :constraints {:max-results 10000, :max-results-bare-rows 2000}}

;; last step
(defn mbql->native
  "Middleware that handles conversion of MBQL queries to native (by calling driver QP methods) so the queries
   can be executed. For queries that are already native, this function is effectively a no-op."
  [qp]
  (fn [{query-type :type, :as query} rff context]
    (let [query        (context/preprocessedf query context)
          native-query (context/nativef (query->native-form query) context)]
      (log/trace (u/format-color 'yellow "\nPreprocessed:\n%s" (u/pprint-to-str query)))
      (log/trace (u/format-color 'green "Native form: \n%s" (u/pprint-to-str native-query)))
      (qp
       (cond-> query
               ;; query-type: 1) :query 2) native
         (= query-type :query)
               ;; add :native if query-type is :query
         (assoc :native native-query))
       (fn [metadata]
         (rff (assoc metadata :native_form native-query)))
       context))))

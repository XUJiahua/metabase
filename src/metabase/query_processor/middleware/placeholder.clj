(ns metabase.query-processor.middleware.placeholder
  "Middleware for substituting placeholder ##client_id## in queries."
  (:require [clojure.tools.logging :as log]
            [metabase.api.common :as api]))

(def client-id-placeholder "##client_id##")

(defn- substitute-placeholder* [query]
  (log/info @api/*current-user*)
  ;; TODO: get :client_id from UserInstance
  (let [client-id (:first_name @api/*current-user*)]
    (assoc-in query [:native :query] (->
                                       query
                                       :native
                                       :query
                                       (clojure.string/replace client-id-placeholder (format "'%s'" client-id))))))


(defn substitute-placeholder
  "Substitute Dashboard or Card-supplied placeholder ##client_id## in a query,
  replacing with user's client-id (like, merchant-id from sso system)"
  [qp]
  (fn [query rff context]
    (qp (substitute-placeholder* query) rff context)))

(ns metabase.query-processor.middleware.placeholder
  "Middleware for substituting placeholder ##client_id## in queries."
  (:require [clojure.tools.logging :as log]
            [metabase.api.common :as api]))

(def client-id-placeholder "##client_id##")

(defn- substitute-placeholder* [query]
  ;; only apply to users who have client-id
  (if-let [client-id (:client_id @api/*current-user*)]
    ;; only apply to native query (sql directly)
    (if-let [sql (get-in query [:native :query])]
      (assoc-in query [:native :query] (clojure.string/replace sql client-id-placeholder (format "'%s'" client-id)))
      query)
    query))


(defn substitute-placeholder
  "Substitute Dashboard or Card-supplied placeholder ##client_id## in a query,
  replacing with user's client-id (like, merchant-id from sso system)"
  [qp]
  (fn [query rff context]
    (qp (substitute-placeholder* query) rff context)))

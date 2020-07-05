(ns metabase.query-processor.middleware.print-query
  "Middleware that wraps value literals in `value`/`absolute-datetime`/etc. clauses containing relevant type
  information; parses datetime string literals when appropriate."
  (:require [metabase.mbql
             [schema :as mbql.s]
             [util :as mbql.u]]
            [metabase.models.field :refer [Field]]
            [metabase.query-processor
             [store :as qp.store]
             [timezone :as qp.timezone]]
            [metabase.types :as types]
            [metabase.util.date-2 :as u.date]
            [clojure.tools.logging :as log]
            [metabase.util :as u])
  (:import [java.time LocalDate LocalDateTime LocalTime OffsetDateTime OffsetTime ZonedDateTime]))


(defn print-query
  "Middleware that wraps ran value literals in `:value` (for integers, strings, etc.) or `:absolute-datetime` (for
  datetime strings, etc.) clauses which include info about the Field they are being compared to. This is done mostly
  to make it easier for drivers to write implementations that rely on multimethod dispatch (by clause name) -- they
  can dispatch directly off of these clauses."
  [qp]
  (fn [query rff context]
    (log/info (u/format-color 'green "query: \n%s" (u/pprint-to-str query)))
    (qp query rff context)))

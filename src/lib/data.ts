/**
 * Wrapper types for remote data with metadata like error and loading states
 */

/** Base type definition for data objects */
export interface DataObjectBase<T> {
	/** The data itself, if any */
	data?: T;
	/** Was there any error fetching the data object? */
	error?: string | Error;
	/** Is the initial fetch in progress? */
	pending?: boolean;
}

/** Represents data object where initial fetch is still in flight */
export interface PendingDataObject<T> extends DataObjectBase<T> {
	/** No data if pending */
	data?: undefined;
	/** No error if pending */
	error?: undefined;
	/** Status indicating initial fetch is pending */
	pending: true;
}

/** Represents data object where initial fetch has failed */
export interface ErroredDataObject<T> extends DataObjectBase<T> {
	/** No data if errored */
	data?: undefined;
	/** Status indicating initial fetch errored */
	error: string | Error;
	/** Can't be pending if there's an error */
	pending?: false;
}

/** Represents part of data object meta that are falsey for valid object */
export interface ValidDataObject<T> extends DataObjectBase<T> {
	/** Data can't be nullable if valid */
	data: T;
	/** Can't be errored if valid */
	error?: undefined;
	/** Can't be pending if if valid */
	pending?: false;
}

/** Represents some data from our datastore */
export type DataObject<T> =
	| PendingDataObject<T>
	| ErroredDataObject<T>
	| ValidDataObject<T>;

/** Represents a Firestore document */
export type DocumentDataObject<T> = DataObject<T> & {
	/** ID in collection */
	id: string;
};

/** Represents a Firestore document in a query */
export type QueryDocumentDataObject<T> = ValidDataObject<T> & {
	/** ID in collection */
	id: string;
};

/** Represents a Firestore query response */
export type QueryDataObject<T> = DataObject<QueryDocumentDataObject<T>[]>;

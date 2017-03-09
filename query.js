import { rdflib as RDF, vocab } from 'solid-client'

const query = new RDF.Query()
const v = val => RDF.variable(val)

const typeRegistration = v('typeRegistration')
const addressBookResource = v('addressBookResource')
const addressBook = v('addressBook')
const nameEmailIndexResource = v('nameEmailIndexResource')
const vcardContact = v('vcardContact')
const url = v('url')

query.pat.add(typeRegistration, vocab.rdf('type'), vocab.solid('TypeRegistration'))
query.pat.add(typeRegistration, vocab.solid('forClass'), vocab.vcard('AddressBook'))
query.pat.add(typeRegistration, vocab.solid('instance'), addressBookResource)
query.pat.add(addressBook, vocab.vcard('nameEmailIndex'), nameEmailIndexResource)
query.pat.add(vcardContact, vocab.vcard('inAddressBook'), addressBook)
query.pat.add(vcardContact, vocab.vcard('hasURL'), url)
query.pat.add(url, vocab.vcard('type'), vocab.vcard('WebID'))

// match(kb, query.pat)
kb.query(query, onResult, null, onDone)

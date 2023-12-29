export function forItem<T, R>(selector: (state: T) => R) {
  return { selector };
}

export function validatorNotEmpty() {
  return { rule: (value) => value != null };
}

export function rules(selector, rule, message, setValidator) {
  return function isValid(obj) {
    const value = selector(obj);

    return { valid: true, errors: [] };
  };
}

export function validator(...args: []) {
  const rules = [...args];
  return new Validator(rules);
}

class Validator<T> {
  constructor(private readonly _rules: any[]) {}

  validate(obj): boolean {
    return this._rules.every((rule) => rule.isValid(obj));
  }
}

function when() {}
function where() {}
function ruleForEach() {}

errorMessages = {
    notEmpty: 'This value is not unique',
}

// https://symfony.com/doc/current/validation/raw_values.html

// We've seen validate() that returns true or false and assert() that throws a complete validation report. There is also a check() method that returns an Exception only with the first error found:

// message templates
// 
// var template = jQuery.validator.format("{0} is not a valid value");
// later, results in 'abc is not a valid value'
// alert(template("abc"));

// pobieranie schema z json, wtedy mamy lazy loading

export function notEmpty(options?: {message}) {
    return validatorNotEmpty({message: message || 'This value is required'})
}

const addressNameValidator = validator.get('address.name');
 // z samym value nie zadziała, a w sumie jak będę budował model to nie będę miał jeszcze całego obiektu
 // w sumie dopiero będę budował te pole wtedy,
 // chyba, że przy get pomijamy to ruleFor?
const result = addressNameValidator.validate(value);
result.isValid;
result.errors();

// można zrobić 2 wersję: definiujemy osobno validatory, 
// albo dodajemy walidatory od razu w polach i wtedy można porównać rozwiązania,
// fajnie by też może było wstrzykiwać ten walidator do modelu? do przemyślenia, czy jest takie coś potrzebne

// formModel.validator.errors.get('address.name') - czy do tego potrzebujemy signali?
// formModel.validator.isValid()

// $usernameValidator = v::alnum()->noWhitespace()->length(1, 15);
// $usernameValidator->validate('alganet'); // true

// translator
// withTranslator('gettext')
When(Validatable $if, Validatable $then)
When(Validatable $if, Validatable $then, Validatable $else)
when((state) => state.isLoading != null, notEmpty(), unique())

allOf(notEmpty(), unique())
AnyOf(Validatable ...$rule)


formValidator.registerFor('path', childValidator)
const vName = formValidator.registerFor((state)=> state.name, notEmpty())
formValidator.registerFor('address', addressValidator())
formValidator.registerFor('address.lines', notEmpty())
formValidator.registerForEach('address.lines', allOf(notEmpty(), unique()))


const addressValidator = validator(
    rule(
      rulePath('address.name'),
      ruleFor((state) => state.name),
      forKey('address.name'),
      whenThen((state) => state.isLoading, notEmpty())
    ),
    rule(
      rulePath('address.state'),
      ruleFor((state) => state.name),
      forKey('address.name'),
      whenThen((state) => state.isLoading, notEmpty())
    )
)

validator(
  rule(
    rulePath('address.name'),
    ruleFor((state) => state.name),
    forKey('address.name'),
    whenThen((state) => state.isLoading, notEmpty())
    when((state) => state.isLoading, notEmpty())
    when((state) => !state.isLoading, notUnique())
    when((state) => state.isLoading ? notEmpty() : notUnique())
    when((state) => state.isLoading && notEmpty()),
    forEach(useValidator(...)),
    forEach(notEmpty(...)),
    forEach(x => [notEmpty(...)]),
    forEach(x => useValidator()),
    forEach(when((item, state) => item.name !== '' ? notEmpty() : unique()))

    rulePath('address.items'),
    ruleFor((state) => state.items),
    notEmpty({ message: 'It has to contain min 1 item' }),
    must((items, state) => items?.length > 0, { message: 'It has to contain min 1 item' }),
    forEach(useValidator()),
    forEach(when((item, state) => item.name != '', useValidator())),
    where((item, state) => item.name != ''),
    forEach(useValidator())

    rulePath('address.lines'),
    ruleFor((state) => state.address.lines),
    must((lines, state) => lines?.length > 0, { message: () => 'It has to contain min 1 address' }),
    forEach(when((line, state) => state.address.state === 'US', useUSCountryValidator())),
    where((item, state) => item.name != ''),
    forEach(useValidator())
  )

  // useValidator
  // a co z parentem? tam wtedy będzie, wtedy nie mamy dostępu do parenta, 
  // wtedy w parencie trzeba to odpowiednio obsłużyć - sprawdzać warunek i użyć odpowiedniego walidatora
  // forEach przyjmuje jeden walidator?
  // w sumie notEmpty to też jest walidator? a ten co piszemy to jest taki rozbudowany, taki validatorGroup
  // przejrzeć jest, jakie on tam ma paramsy, jakie nazwy itd


    notNull(),
    withMessage('This value is required')
    {
        rule: (state)=> state.isLoading ? notEmpty() : valid(),
        message: message('This value is required')
    }
    
    [notEmpty(), ],
    [startWith('M'), messageKey('startwith')]
  ),
  rules(
    forItem((state) => state.name),
    [when(
        (state) => state.isLoading)
        .then(notEmpty()) , message('This value is required')],
    [startWith('M'), messageKey('startwith')]
  )
);
{
    target: (state) => state.name,
    when: (state) => state.isLoading || Promise(value)
    then:  notEmpty(),
    message:  message('This value is required'), { message: string }
    messageKey => { messageKey: string }
}

import {
    getExitName,
    getMinMax,
    isFloat,
    isInt,
    parseNum,
    prefix,
    strContainsNum,
    validateCase
} from '~/components/flow/routers/case/helpers';
import { getOperatorConfig, operatorConfigList, Operators } from '~/config/operatorConfigs';

describe('helpers', () => {
    describe('validateCase', () => {
        it('requires arguments when exit is set', () => {
            expect(
                validateCase({
                    operatorConfig: getOperatorConfig(Operators.has_any_word),
                    exitName: 'My Exit',
                    exitEdited: true
                })
            ).toMatchSnapshot();
        });

        it('does not require arguments without an exit', () => {
            expect(
                validateCase({
                    operatorConfig: getOperatorConfig(Operators.has_any_word)
                })
            ).toMatchSnapshot();
        });

        it('suggests operator exit names for no operands', () => {
            expect(
                validateCase({
                    operatorConfig: getOperatorConfig(Operators.has_text)
                })
            ).toMatchSnapshot();
        });

        it('suggests min - max exits', () => {
            expect(
                validateCase({
                    operatorConfig: getOperatorConfig(Operators.has_number_between),
                    min: '5',
                    max: '40'
                })
            ).toMatchSnapshot();
        });

        it('cross validates min - max', () => {
            expect(
                validateCase({
                    operatorConfig: getOperatorConfig(Operators.has_number_between),
                    min: '50',
                    max: '3'
                })
            ).toMatchSnapshot();
        });

        it('does not suggest an empty range for exit name, ie " - "', () => {
            expect(
                validateCase({
                    operatorConfig: getOperatorConfig(Operators.has_number_between)
                }).exitName.value
            ).toEqual('');

            expect(
                validateCase({
                    operatorConfig: getOperatorConfig(Operators.has_number_between)
                })
            ).toMatchSnapshot();
        });
    });

    describe('prefix', () =>
        operatorConfigList.forEach(({ verboseName, type }) =>
            it(`should prefix "${verboseName}" operator appropriately`, () => {
                if (verboseName) {
                    expect(prefix(type)).toMatchSnapshot();
                }
            })
        ));

    describe('getExitName', () => {
        it('should create range exit name', () => {
            expect(
                getExitName({
                    operatorConfig: getOperatorConfig(Operators.has_number_between),
                    min: { value: '5' },
                    max: { value: '10' }
                })
            ).toBe('5 - 10');
        });

        it('should defer to edited exit names', () => {
            expect(
                getExitName({
                    operatorConfig: getOperatorConfig(Operators.has_number_between),
                    min: { value: '5' },
                    max: { value: '10' },
                    exitName: { value: 'My Exit' },
                    exitNameEdited: true
                })
            ).toBe('My Exit');

            expect(
                getExitName({
                    operatorConfig: getOperatorConfig(Operators.has_number),
                    exitName: { value: 'My Exit' },
                    exitNameEdited: true
                })
            ).toBe('My Exit');
        });

        it('should use operator names as necessary', () => {
            expect(
                getExitName({
                    operatorConfig: getOperatorConfig(Operators.has_number)
                })
            ).toBe('Has Number');
        });

        it('should generate names for single operands', () => {
            expect(
                getExitName({
                    operatorConfig: getOperatorConfig(Operators.has_any_word),
                    argument: { value: 'color red green blue' }
                })
            ).toBe('Color');
        });

        it('should have empty categories without argument', () => {
            expect(
                getExitName({
                    operatorConfig: getOperatorConfig(Operators.has_any_word)
                })
            ).toBe('');
        });

        it('should have empty categories with empty argument', () => {
            expect(
                getExitName({
                    operatorConfig: getOperatorConfig(Operators.has_any_word),
                    argument: { value: '' }
                })
            ).toBe('');
        });
    });

    describe('getMinMax', () => {
        const emptyStrs = { min: '', max: '' };

        it('should return emtpy strings if arg param is an empty array', () => {
            expect(getMinMax([])).toEqual(emptyStrs);
        });

        it("should return empty strings if arg param doesn't contain two number-containing strings", () => {
            expect(getMinMax(['a', 'b'])).toEqual(emptyStrs);
        });

        it('should return a number-containing string MIN and empty string MAX if first arg is a number-containing string and second arg is not', () => {
            expect(getMinMax(['1', 'b'])).toEqual({ min: '1', max: '' });
        });

        it('should return an empty string MIN and number-containing string MAX if first arg is not a number-containing string and second arg is', () => {
            expect(getMinMax(['a', '2'])).toEqual({ min: '', max: '2' });
        });
    });

    describe('isFloat', () => {
        it('should return true if argument is string containing a float', () => {
            ['0.2', '.2', '+.2', '+0.2', '-.2', '-0.2', '2', '2.'].forEach(arg =>
                expect(isFloat(arg as any)).toBeTruthy()
            );
        });

        it('should return false if argument is not a string containing a float', () => {
            ['u.2', '0.2u', 'a'].forEach(arg => expect(isFloat(arg as any)).toBeFalsy());
        });
    });

    describe('isInt', () => {
        it('should return true if argument is string containing an int', () => {
            ['1', '+1', '-1'].forEach(arg => expect(isInt(arg)).toBeTruthy());
        });

        it('should return false if argument is not a string containing an int', () => {
            ['0.1', 'e24', '-.3', '5+', '5-', 'a'].forEach(arg => expect(isInt(arg)).toBeFalsy());
        });
    });

    describe('strContainsNum', () => {
        it('should return true if string contains only a float or int', () => {
            ['0.2', '.2', '+.2', '+0.2', '-.2', '-0.2', '2', '2.', '1', '+1', '-1'].forEach(arg =>
                expect(strContainsNum(arg)).toBeTruthy()
            );
        });

        it('should return false if string does not contain only a float or int', () => {
            ['a', 'e24', '2a', '0.2u', 'u.2', 'u0.2'].forEach(arg =>
                expect(strContainsNum(arg)).toBeFalsy()
            );
        });
    });

    describe('parseNum', () => {
        it('should return a float if passed a string containing only a float', () => {
            const float = parseNum('0.2');

            expect(typeof float === 'number' && isFinite(float)).toBeTruthy();
        });

        it('should return an int if passed a string containing only an int', () => {
            const int = parseNum('1');

            expect(typeof int === 'number' && isFinite(int)).toBeTruthy();
        });
    });
});
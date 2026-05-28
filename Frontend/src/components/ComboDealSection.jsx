import React, { useState } from "react";
import "./ComboDealSection.css";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";

const parseVND = (str) => parseInt(String(str).replace(/[^0-9]/g, "")) || 0;

const combos = [
  {
    id: 1,
    name: "đồ hộp",
    price: "55,000đ",
    rating: 4,
    img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 2,
    name: "Phở hộp",
    price: "65,000đ",
    rating: 5,
    img: "data:image/jpeg;base64,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"},
  {
    id: 3,
    name: "Berry Tart",
    price: "75,000đ",
    rating: 4,
    img:"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUSExMWFhUXGRgYGBUXGRgYIBcWFxYdGhgYGBcYHSggGB0lGxkaITEhJSkrLy4uFx8zODMtNygtLisBCgoKDg0OGxAQGy0mICUtMi8vLS4vLTAtKy0tMjgtLS0wLS0tKy0vLS01Li8tLS0uKy0tLy0tLS8tLi0tLS0tLf/AABEIAOEA4QMBIgACEQEDEQH/xAAcAAEAAgMBAQEAAAAAAAAAAAAABAUDBgcCCAH/xABGEAACAQMDAQYCBgcGBQIHAAABAhEAAyEEEjEFBhMiQVFhMnEHQoGRobEUIzNScrLwFSRigsHhNEOTwtGS8RYXJURzw9L/xAAaAQEAAwEBAQAAAAAAAAAAAAAAAgMEAQUG/8QAMhEAAgECBAIJBAICAwAAAAAAAAECAxEEEiExQVEFEyIyYXGBofCRscHhFNHS8SOSsv/aAAwDAQACEQMRAD8A7jSlKAUpSgFKUoBSlKAUpSgFKUoBSlKAUpSgFKUoBSlKAUpSgFKUoBSlKAUpSgFKUoBSlKAUpSgFKUoBSlKAUpSgFKUoBSlKAUpSgFKUoBSlKAUpSgFKUoBSlKAUpSgFKUoBSlDQCot/qNlG2Pdtq0TtZ1Bj1gmYrRe2f0k2rW6zpHVrowb0bkQ+cR8bfgPeIrkuovC4WuPe33WYMbjd40iDMjuzJ484AERVE6yi7I20cFKavLQ+l7estt8NxD8mB/I1mBr5la3aYHKySckKcE+9tTO3zkZ4gE1+2GCYVkHGQ1sSQTM+IGPtP4Zj/IRc8BHhP2/Z9NUr5st6q/nZqbwM+EW7nOeSFvY9IE/hmWnUtcpATWaqPrEnUHbB4AJO4x9kkZ5I7/Jj8ZD+Byl7H0RSvnuz2n6oDtGpvD3cY+wus/fXr/5ka9JB1NwxyTZtf9yz94qSrxexGWAmuK9/6PoKlcO0f0k65oC30JySbljaBHkzrAE54BGORS19LGv9NO3+Rv8AS7XeuiRWBqPax3Glck6L9Kuou6mzYazZi5cRCy7xAdgJEsc5rrdTjJS2Ka1CdK2dbilKVIpFKres9f02l2/pF5Le7ChjkxzAGYHrxkVATtx00/8A3unHzuKv80V3K+QsbDSqmz2m0TfDrNO3yvWz/wB1TbfULTfDdtn5Mp/I0swSaV+BgeDX7XAKUpQClKUApSlAKUpQCovVP2N3+B/5TUqovVP2N3+B/wCU1xko7o+f9BomuJOAQrGMHCAFhkgTBECZOfSs+r6Q6gk2GaDHhe0+QA3wAbuGH31adB7JX7qB7rCwjAE7huZhz+zOAOcv8wDWDtN0vTWWZEshtqoodiwJdhuLEIVWIKgQPfNecoNRu0fWLEU5Vcid/JXt63X5K+/0FwDNhgBuJLqu2EJD+NSwlSDIMRBmKgarSorKkKSYBAPDExtx5jE/P2qR0zXIGO62N2QDLmQZJVhcYjbuycZJr3c6IXRriX7dwSQ67trnzYw2G9ec45o1FbnZTUd/t+39zHr+jC2GF5GRxsARtyzvnn2gGoJ0Vs7fCfEYBg88RJ85xVz1od4WdroIUKoM7mdj5mSCfrZ/wVE0PULtvT3B3sIz4thuHO2XiMEoIBnENweepHEnpoiA2nQNtDEGSMEeX2VJuOSVUvJAhZVZA9jE1l6GEW8Hu2VuWTvRgzbQGiVKuMggwceRIzIrDdRW1BAAA3EfWYKACSSQCxCxJMHANHB7pnEqT3j6mBtGJwQJzEf71j1t24u0BlJbAGxPb1Bqff0kMrkSGna65ViOYYYJHpyPMVHuoA4bM4n5b1zFQWrsyxUqS1SLn6NNPGqlgCdtogxME6m1MH1jE+hNfQFcB7E6wW9ZbBLHvBZQQMEm/bbJxAAH5V36t9LY8DpS/W3YrSu3Hb+1oybFsG5qIzC7ltSJBeWWTGdoM8TEid1rgn0ik/2nqf4rcf8ARt1ro04zbzOySuYIRcpJI1vXavv7rXr965cuNyzoBxwBtchVH7oxX4b6AAJfKxIIm8RBzAAUx95nFW1zs/qF3YtnbvJIuACEUMYLRODj1hvMGsKdG1JXd3DFc5BXybaTzxJieOfQ1Jzot2dR/RW/8noRwleKzJL/ALL/ACIFm4JJN9STEk78+KTPeWvT8fww39GjEeO1A85sgz5/uzn1mKtNN0PUOz2107s6GHRVBKn3jy96yjsrq4/4S5jkBQfyNXRoxWsZr6L8WM06s+7K/wBWU1rQRkMBMbSrWs+uRcxBx5nzxxUsW9SoYpfvEgiNj3PFjJ8LYHkPMxwK9XejXVUk6e6AOT3b4PoSBE1BezbjgfKc/dVnVVXtKP0f+RV2eXv+iy1PWtdpwCb+sYkTCPdhfKCSxg/ZTRdvtfMd5rAfLxq8zxi4uBJ5n0qJYud2pCMVVskCCD8wQQa8XbanJCz+9st+f+Ws7wuIvun7e1vyTvT5F9f7e9RtNC61nwD4rdnwk/VMIRI9iR+Qy2fpQ6kIAuo5JAANtDJOAAEAkzWus7okJcZQJIC+EfckV501tjctu7S3eWTJM473bg+mBmro0pLvpefxIrko8D6P7M6m9c0tp9QALxX9YBEBwSGAgkYI9TVpVf0L9iOPiucZH7RuD51YVge5WKUpXAK8Xj4T8j+Ve68XfhPyP5UBzXtT1drNvcDlnCz7kFmJJHkFYcHJBrmmr1t24zAszl2kgSdzDggeZ9K671jo1u+LmnuyNxV7bjkMFOV8sAsI8xXOtb08aG867hccJiVK4eRAEtmIz71glJuTufQ9Hypqnlj3vnEh624truyi2w5UO22SMsYUlmJMAD5ziKzaOyo012/jc0LA+r+sUkewI9efsqD0rxsLPcrdNyFGSrKf31cSR7gggwMcz71F20tprQBLB8PgBlURJXOZk88EelRtob1vlXC3qY9CVZ0tOQtoEkkwMH948/0aavqBW41xAFBJ2tsHwziJGMen+le+n2LZVrjISN6pvYnaoOSFRcu5jzwAPXBxdZvh7hClSghU2ggFVwsA5n/Wu2vuRbU7pr+iV1PUM9q2wwsvtk5Yg5Y54kwPcNx5++jaN2tN4dq3SU74+YBG5VHJAhtxBgxBqDq9Nena0uUVRCy2xTkCPIZ8sZ5qbqL7adrQDEslucs0DvASQBPhhSMCMjIOZ6mtkRfBQtp/stOwXVLaXn019Rc0t+NwIkJcX4bvtI5IzgH6tZ+3PZJdHeRrbzauhtu6JUqVMEnDDxYPPrxJ1Xodz9evpkN/D5nHEcz5RW1de1huaHRBmB7s6i34Z4QJtDH1iDj285FTvwfIx55RxHYej3XzyKfst/xml/8AyWuc/wDMt+/9fl9EV879mGA1ekHq9qJ8z3lvAHtB/wBq+iKuo7MydK9+PkK432p7O6jVdT1RQBbYa2DdeQo/UpIGJY+w+2K7JWlds9UylhIkwoDTGQMQB5kx6/mNEa/UJz8DzYRcpWRz7qej6boV23Q+pvEGCfAk+e1UYEgT5sa1uwwZC72ltqcKqM5loJ8QdjiBIPBg+kV+dU0SWXe6xY3Ldx1dQDsJDMsSW3bjhgATAJmMEVmq1G+Ljglu8Cm2TBgAA7lbK+nEYNcjTU3nnZs1zxdamskZS+rPYvtdZ7gu92luGLDduMgzxkzxPnWHc5O62GVQYOfTMvmCASJJNYdA9t2d7kKVjYOBEmSBBBIxg+tY7nVrkNagHewMkc+3ymB8hFW5Y2MWeV73LV9Re0yuBcIuOQxNhnWAJ9NswZzxnyip57W6rubTXW79RG9NRbS4GEfDuuLOeZHGPlWr2FAa4WuRthTtjJnhSeII59qXmuFxbUqRkK0DO45lgMt/tSyvc5mZvdjX9M1Td3ctNojCnvLdwXLYJnDWzJtnB8IINOr9k7tu331spqNPz31nxBR/jT4kxnzHvWkacs1wbQZ2kAjAwMgHyzP4VsvY7tFqNPqO7tXNitvnfI33FGPCxzLGIPqxEHNdWJqUlmvdcv2WxtJ2Id1Rt9q/d0eLBKsjZxO12bnnOMj1ro3afs7ptXpruu0yizctbjetiNrFVDsVjAaDMiJ8wDkc6uxLQfJT5ep8wfcZ/wBq2wrRrRUokZJp2Z9DdjLzPorDsAGZdzASACzEkAHMSauqouw3/Aaf+Afmava82XeZAUpSogV5ucH5GvVDQGr9YXCOJBEgEYjz/wBDWp9oej2tUZuP3NxVC95hg8cblxJzMiK37qGiEFRkETt8x71qOutlAwOQQIPOV4n/AM+1YMRTmnnj6m7DVsj0dmabq+jXenFb6kXgQRu2EBZECfEYBnB9QK1B25PlXVF1I7y2bbkblJWDIVomIJ4OQRUfR6sq1x+7tErAPhCnPmCBI4OKoVdcT01iZZdVd89jn36URYW0D4Z3n+Pyg/L8fmah6O/suozcAzHqARP4Y+2uh6sae+pu3tMrEkjerFDj97bE170eos2bc2tMq7h4mLbtw9CXzHtxUlWVjs8Te1o7eXz2NFvambhdJWTIIJBXzEGZGMRPGKyDpOrcl2ttnxF5QCD58gCtr1SWA6uumsKZH1QRPPA+XtX5qte8OSTtgkhBjGTzPGPvFOt5IhPENu60K+yps2jbVV7xhl0g48lLcny+/FbB9IHTF0+m0NhWJ2i/k5JY7GaAPcmB5CKj9mOjPduJduJstLDBTgu4aQSP3ZAPv8qmfSc526cT53f/ANdaKcGouT4mWlUviIpeP2NN7LQNboxIHjTn3urxPrJr6Kr5/wCxzBNXp5KiSig4yTeQECRmYjw+XJiZ+gKuo7HOlHecfIVqvazSFgbimChEkcgHaJBjyP8A58hW1VV6vJuL6j/tqdSOaLR5sJZZJnLe1nZ213B1dt7oU3e8uWn2sF3Nm4JWVKtkySCsg4rmnVbKadnhQ5fKuVECSSduI8xxEcV3B7JQs1sLtIhrTDEHkRweDg+9a51Ls3pb0i2Fs3Cf2TBtm72UjwE+1Z6GLy9mZpnSzao5bpivcboyznaCGIWDl+IwAJIzXm1qjeZ3uOAEG4fCCQDGFJ/AVc9W7O3lLW007W2C7PhZwfFuLIdp5wJWOBPnUC1p206nvrRDGCFuJtAgwQAR6R4uePSt8akXomZ5U5LdHq31FNxTu2ctHdoAD4du3btk7eJgRMCarr6wVtm2VVQzEHBYTJJM8+GB5jNYjqAj7rW0SOMHnBEEQP69qx98WNtQgMH4RncT7DmpOXMioN7It79zcy7bIsW7h+LYRuSQSZaZgcAe/NYeg6S9evWWt7S27APChCCWPp6YzxVyvRdZfDbtNsDBQbtwxhTiRM4HoKuezPZn9Edrm/e7DZ4YAAaCYk5+HnHNZsRiYJOzLqVKV7mxae6Ra1ywdr6XUEgAxxIZscfEB5yT61z+7dA38fChznABBjOfs8q6xpNCq9N114k7ms3lAJELbAJj0+Kc+1cn1PFwAGSq4yckn088/wC1aOjE1R1Fdpz0PoPsIT/Z+mkQe7GPTJxir6qTsUpGh04IIOzhsEZPI8jV3UJ95lApSlRAqN1M/qbnl4Hz/lNSai9U/Y3f4H/lNcZKO6ONdJ6teutcusWfUWbCGy4J3uy30UBvJge8KtjxAicgGpvUutX9SNTcW5ARS727e07bSP3d1Rc2wH+uCZ3KeBGdW6VrrmmdL1ltroIBPiBVhBVgeQcfcKwWbbhTatu6i5CsqsVDyRgrMZxWCNXSx9VLCxc72XC35XzmbVqtGltdP3NnUh0t2i94WVRGDgOzXQgY3GW2QPD8OZJrH07Trde+q3dU+YnTW1cOhyILKFSJIktmMVA0uo1FhrepuWXuXUDW7N67cYogSU8NtVE7RPLEEgmvGj1iW1trf01xiq7VuW7z6csgJIV02w0SRuEGI9K68jeqKXRlZ21+n55em+2hnWy4Y27dnuVQMtzvbm0NdCC4YALEsqbmJEmGAYkgFvdjT3LxtacYaULkHAskg95uWQVZTCkEySAM4quPVCEuWxbIW41zbc3d7ctWru3vUUsVDlhbVdxMgbh51j1WrW5cUutxbNu3btpZRgS62t23vLpgK0kneFJG6APOoNU27k3Qk3d/3+X8423tOo6CO7uW7xu23vPatKym3cJXHjFwIDDHYSIAYgZmrHoOjK7Wu+Bmt3XBZ3UI9l+6dbqEwpD4BHMHg1SP2hu3NWNRqPEqwyWVmCbbbrdvcfhXfDMxydp5MCv3UdXtmxZ3I93VqLwIbFpWuX2u96w/5p8QheJGZ4qyLgndFNTCSkkmt/35LTjwNq6b1sgWRe7q4btvvUIGwqyXCpBEneNwJBB+YHnSdsuo95cQFgWUOSvO0HbEiccce1QdX1nbY0unQ27qnTMlxGG7u7puOQw87dxZBBHMDyg1S954xAJIBk+skecVN1tMpyngbVOt2tey9vQm9mn3dQ022WK3U3GOAXSeftn/AN6+iq+cOxNxl6hbVV3brqAmeFF1SW9+P68/o+raOzMfS2k4rwFRtTpt2Rg/nUmuJ9u+s3rXUL6C5cNpblu4bQuNb8Q06jwuslOZ4IJGQa10aTqOyPKSubf10qlw296rdcYtlgC3uo++q+9qlZ7a3AJYbWB/e2//ANVpmt1HeKm7wX76Xb9y45e8bWms2zcsli7SCxtsw27YDKYnaa2PSdVUXHsPbv3dty4q3AneNtTbwE8dzaWgsqmJE+tVYjo3NrF6l8KrjoyVYTxsEuMpAkSSwiYIIJ4zUfVBr0pdFq6AJ2umMzwckHFQupasIXe1buqyrDXNQHsW0DkBdxdQZLQBj1zAYij/AE68hvHvX3WlsC8jWgpDXLwRkUzAI3ggkMDmCRBOOHRmIfJF3XxJ9rs/p0uEjT2eJ2kuR9hP/irK3b2vi3YUxiF49PEBULTbu8vBr9om3cuWjJFtj3Tsu4oSYnmKj2dQxud4Wi20RcIIAGBPrtJIO8gDxL6iaZYTE3as3Ys62DWrLguZbfdYquTERgTiQf6FYtFba4VS0gyTuYD4fLJ+/HtUHpLMhN25Nyy3eudjIWW0lyO9a2xDNbJ4Kg/CfKCbr/4qspZLJYeZlRcO0Mq3BbdyVkrtYQVI3e2avp9GTb7fsVSxCXdL7qun7rQX7YJIFi4ueT4D6eprjxAUFySB4T5cK/tz5nHp7wN86310HS3bbgWtve2Tb37puAlSocZbPn5e0Vz3qNzAWJLgAEngYAPE+kT+Pn7OHhlVjHe59E9jbwfRWGEgFBEiDEmJWTHykx6mrmqPsRbZdBp1b4gkH5yfWryscu8zgpSlRAqL1T9jd/gf+U1KqL1T9jd/gf8AlNcZKO6PnF7aFADAXEGvd22IGSsEQQTPP5170umW7stiPEQAfT1P2Ca2G/1NdDbC2DzMsVEsfQD0H3D515Ga1ktz7CrX6uyWr5GD+x9SVQNZ1OS20hmOWXGPqkHMmJ49CI2uLrdC3WvoQBKtt3HwZORkFh7ggCeKwWOv61zA1CoG8mIjJ84HvWwt1bUWRat6+1avWLmEvLFxW9lcAFW5MEA4McVbaoldow/yWpdpL55lVce0UxqH3d2AQ9skb2fc67gNxUHI8jLcGJi3rksSHtsCWyyEHxIvoZGZUekE+YrN2i6G1lke3cD2XJ2MM4iQrD96PsOT5RVfZ0ty5cRU9YIgnn5f7VzPobYKGXMpafPAnl9zDGmIY25BLKR4QTwIABBBOfi88RA1GollAtBfiJIPkWkY8omPkBW9dG7I2ys3DuOd0RCkYYEmcghhOInyIBFjrOwlm4pNo7WE+kSVkfCBt+p5ERJ2ktNQVTMY1jqMZW1OXG54wu08c4/qKldPtG5dFpLe+4QNm6Agh1Ja6TwgAM+sgfPL1rpt3TXjbdDt8UNBgjcQMkATCzieRFWXY8r3t3cGAW35RJBYTEmPLz+7iraavNI04islQdSOuhZ9J6Jb02r0QQ7i28tcIy7Bre6fQAkQvl85J7FXMHuAavRD1LDgyTutjIJJGRHtHPNdPr0Iq2h8xWnKdpS3FcC+ki2D1LU8TutnIBGLNvBU4I9jXfa4J9IwH9p6r525/wCilbsF335FMTX7Ona6bxN3Lo5uMzZuAEEpuiZJAxgHaBwKn9X6ZqLl4i9cGou7V8aureGDtC8QInAAySeSaqrarGOKs+k9DvujPb07XEhhPof3kEglh7A5rfOSjq2l5kyE/Sbg3KQSczmQdn2+KCce7epqSt/UA2Uuq7rZ8ItwVLbGDpZutEvbRkkCJA3ARMiR1Dpt2ym+7pWtKzAhpIA8IGyfqy3izmSYrHpL9gJ40u95+rhkuRkBd5zwSQxB8pH2cUlJXWvkCNc6jqdpDXZ37n2tbtMD3rFmK70JgszHB88Vk1XVy24m1Ddzdt7QQVa5eti3dvOSZHgUBbYEDYvixn3d1C57t7wjdtDQQAu42gRJmDsmZ+t86/UviIN0jMS1oXIQy5PrPeRx8/qgHtlyOGHU9SZ7A07OzIzA37xUb2tyD3VoDK2lKhgpiWjCARUrrPWEvqrur98WuhlOLdq3cvs4aRm6wRlUCABtJMmBWK/1NgwcLacyLhBtiA7A7lgzuAn1Pwr6VC1F8lV8IBChcRmBEmOT6/OiiuQJPaPWrdv3mVbUd9qIvWwB3qNdm2XjwmBMPywYTMSanqlzbsYxiT/6T5+Xlx/7CXviDsLZHgGCc/DI4J4n3rbL3RQmi1dy5BvtZYAqfDbSGJs2v8IkeKfF7rlqqs1TscZ1nsarjRWBdjvAsPHG4EzB881dVX9A/YL83/narCvKbuyIpSlcAqL1T9jd/gf+U1KqL1T9jd/gf+U1xko7o4T2bgtKgEhJX2yAT7GDFVHaS6Wvv/hO0D0A5/GTU/o2phlHAuQvmOcj8qj9q9Htu94D4LviB/xDDqfec/5q8inpU15H1jX/ADO/FafPqUFx4wal2uqXlsvplc9zcy1sgEbgQQwkSrSBkRxUZ1H3V5tCczWxMrnBN2aN06I4v6K5auEhrc3UcHhkU8g8ggkfNqtuw2nH6y6QDsViJ2iIAkyxgYJEysbjJIPhp+nqdPYYOhIuqyHjwllJWZPkQOPT2qf2G6sti/Dnw3IU8eePMiTO2JmBvgS1YrXulsUyUnRlY3bTPZKjeSBcLG3sLnJQs5Q8lS27aQo3RgEET+jT2EaQdQhIUb4a1ua2htquwqsnYSfCsAJJiDNp1K45Fs2fEGnxLtjaV8LFyZCydw2gkkDjzqr+puq09yGdDsFxRuZrQUORueMsSF5+Lcfq565ZUeZGEZ6/kpe1+kRtGpW4bzWRtN1ipZgBuBZoycATIw7xJIB1fss/6y4CDGweU7jvWAOQMgc/nFbD211+yx3QYszknxQSA0wIPGSTEcI/Bg1Qdkc32BGNk/ZuG48jgCecc1Zhm3JM2JNYSouBsCX1Or0QAIAZwMkDN1YgR5CB81P29Yrk63t2t0pEtNx3JgJy1mCfNh5evh4rrFekjxp92Irgn0jEf2lqvnbn/opXe64T282nq18ESN9kMB5g2rcj7q24R2k34EY7mPpli1pLX6ST+t2hhIEWw2QR5loIGPWBzVJru2uruOWW7sH2TH2fD95qX9IGoZbdtY/eaB6JAUR6DccVzd7uSfWvJhfEPrqmt/ZHpNKCyo612W69q7hbZqbVy4f+RdAQ3Bz4GPhdscEisnVumJq7TanTbUuKG76wBtJKzuZAMTgyuPhPnIPI7d4wIYjzkYj7q236NesMmqNtyXVwTBJzPhYTzkH8Ksu8O+tpaW3XBoraz9mXoz2EO2Bk+UZn2Fbj2b7I94AbxiQSFAyQDtLAN5ZGYPIIjzq9J0tF136OpLIrwpMEwYgEkcruiYOV4iY6Qb1sXGDBQtnwvBwEZBCsAwUEsV2q0kiTtAhjs6QxVR5YUXa6vfjbgZopLcwDsXpHBUiDJGCkglZiNuDsg+sAHkknS+2HY67pR3iDemfhDmOJhYO0CWwWJhSZOQN/ZdNt3ot5x+rdYVgvgUKsXiscETLwNp+GGrzZ09hg6C9cuLdRUCXDuWEUgOm5YBZSDPnANYaOKrUHdttcUw1fY4/o2/WWsc3LYP2uK6L1tj+h6rH/AC3I8W4gHEREqIKjMcYgYrnzgpqAAOLqegiWU8eUTwYI4IBBA3vtDcI0t9T4ibbqWdwYbcWYqFHiMgj7eOZ9bEyUnBriVM6R2cfdp0YTncc45duR5VZVVdljOltGIwcZEeI+RzVrWIiKUpQCovVD+pu/wP8AympVReqfsbv8D/ymuMlHdHzk96EDEHyx/XFXFjq1vu+7vjchM5kfaD9VhVO92EB2nyx6V+37oABIPI8vfzryXG59nOkp2TXHgXNnstauuBbvmDnaUltoEnaQYJ9MVi0Bs3ri2bKpaUgQzfE7KQfG6gkSfIRPtFTux2rRb8MYLIQnzEMfkYFWXaLs5ZvFCPDdfl1AIMg5ZDAJ9xB+dcU8su2YKk5Rnkm/J/NzUu0F57F50uXFdyQxhmYDzUZPlA8pH21+63XneqXUVbilWNxDllIkbSpC5/eIr81PY5wxVbtliOZLrj7Vj8aabs+Zm5etj+Hc5x5AQF4GM1Y50nrckqkbLwNl0nX9RprdtkYXrDgxJB2svh2FhPi8GTPm2CaavtteYELbAJB8URBjB+JvM8eWzk7oWHrbidwtpMIi+GY3FgwLMSMSZz86oGRtwIbGcf1/WKpSUtWco4elVvJrUyavUXbl3e5kHd7RLE/ac8+g9hV92MLd7eAHFqVIkmVdWwADnA/rihs6e49wbY2xn2/8mt16J01rFxCR8SMWE+IL3lsAkDOSeBEQc4NW0qsVWjDi/wCiWOcYYdxVtj2gDa7SnyNx3AIAjNg+RO7iJ/w4EAGus1yXRpGt0vGC6kAEQQ1sAZA3eEAk+rRmJrrVemj5ufdiK4N9IV2OqagjlWtkY8xZtkV3muCfSM3/ANS1OODb+39SlbcGrzfkQjuYO0Wn7/SrdTLIO8Yc/q7gG6P4SBPtNcv1ForM8TXQuh9XNoznbnHMSfTzHqPes9/o2i1QNxGNkn4lC7kn1CmCvy49q82dKWEbjJdng+GvBnoqaqrxOaIvtI9q3LsN0pu9N9VJFtSBxlsNAn2H4irXXaSx089wLavd8Lm9cRSACMd0hkATOcmQfSKj9R1JsdwxvBrYO4IGdjJBLTwJJxIAmajJurGy2f2OqKjqZ9V1IHUtqFBWW3lRtnIhwDkAnxZHEyCDmu0dO6sL+mN20wL7WwsHxiQCF3jBIkAsMckGY4ZY627Wbt027d20GEq3xW3uCZjBjdPB8verXs1rru130lxg9tdxtGDvUlgdo5ULIJAJkgewq/EOFWMVazjom9mvFmaVJrVO5026b21e9tC6jQXtuRcYG2AUxHdhiULGIXcwA43NFfXuqG9e3q6JtZfDtc7d8qASDmRyODIwI1F/pBvkH9UhPl74nncIkmOMAT4iYGvdc6zf1PxEACfCI4x5xj4RMQDmqY9HYipLLNJLmRzxS0I/fFrwaJm4nB+qGVREKDEDGJ9ZOT0Htdb2WL7DlrdwDkQNp8JBJwCCTweeANtc80rEPbOPjSf/AFiuhdsQy6bUMSYCXvMgZ3EAAgxznaZyPKvWxMVFwiuBQzofZcf3W2IjDYmY8Z8/P51a1WdmrYXTW1HA3ARjhz6VZ1hIilKUAqL1T9jd/gf+U1KrFqrW9GSY3KRPpIiaM7Hc+fdHZLWSRZ3sGThjIEruAUYbB58p+VYdY6qhPd3AdwiRIA4g553Bo+UVvFz6MdUoi3qbRPuHT8pqHqvo+6jETaf271vWfrIK87qpJbH1McZQcr51v4r7mlXrwETPIjBwfX51ar2hdDb3GdsAe6gRn7MTVvqeyfUlH/Dlx7NZbkAE5aZgD7qrtT2f1ikFtHdMEcW90R5+Cf6NQdPmmW9ZQqJJtP1RjPWR3jEn4wQB/R/qaj/pcECef9Kx6zQ3AV7yxcWPW26+uTI/rFQ7wTcN0bvu++q8iQWGpS5ki/cLQJIAJMev+1eU0bu4YEwMHj8PX/apGg6Qb1xSJ9oPPy9B6mrfrPW00P8Ad9MFu6wjJ5SwPf39vtPkppnWebJTV5fbzE6saKUY78j1rep2en27ZC97qbo3WbQ4UHi45/rggRBIx9gRefU3ruouF7lxEk+SxdXwgeQAOIED2jcNcuC9curevXe8cJsLbVXG6QBtAxJOYmrfs/rTZusY3blCIg+J2LDwIOWLGF9ACSZiDdhKSpSTere7/C8DHXw8pUZSl3nsuWpsVhmOv0qW0d3NyTMwtkKhdyT+7hRACyCORFderXOx3Z86dGuXiG1N2DcYcIB8Nm36Iv4mSa2OvWjfdng1XHSMeHHmK4J9IxP9panHnb+39Sld7rh/bG2W6xfXYrSVhWO0H+7Kckcex9Yrbg3ab8iuJp9t5ExFZNFfUMrsDtDAsAOVDSwHrImpwtQV36e4PiJAzKsSbcCQcAHmJg1WW7mJj+vavS0krEzqHWNJZ1Vli8OsAoQYIJEgq3lP41onUewoUKy3lh8hXDAj2LICD84FR+m9Xe0jKp8B5BnBHmPvqdd7RF0TcIKACRBmPmea+an0diqMmqWq9PsboVab72hVjslcU7Gu2lWZIDO3HqAkn7SK2Lo9hNMjqjb3YLucqFAQZ2oskgZMknMCoGq6wrEuCc5iP6H41Ev9QJB24xEn84qCwmLrdmSsvp+ybqUo63I2vt+NwpxuaPlJxWMoxELlvlzX6LDP4Vkk/j8zWz9C0NqzafUaltqWxLnkmTCqseseWTMfL2cbjoYOkr6y2S4v9GSlRdR32XP5xPPSez7d211tsgYJwN8wqqfUsQJ8pxnm+7Y2/wC76hS3iFq5tgyCV3BiD9UAscqAQfCWMmdI1nW72t1FliDa06XbZtWAYmHEO5HnHHkPLzJ3TtgU7m67qY23FYhRKh93dqGcyZkYggllxxXm4eOJdqmI3k7pcly+fs5iHG6UdkdO6B+wX5v/ADtVhVV2V7z9Esm6nd3GXcyfuFiW2/ZNWtWvczClKVwClKUApSlAKUpQCsd2wrfEqn5gH86yUoLkVenWRkWkB4kKox9gqlbsH04kkaS2pOSV3IT9qkVslKjkjyRONScXdNmo3fo40BMhLin2uufwYkVn6J2F0umvjUJvZwCE7wqQk8lYUZIxJnFbPSuKnFO6Ra8VWayubt5ilKVMziue9p/o6uanVXdSmpVN+0hDbPh2oq/GHzO2ePOuhUqcKkoO8Qcff6Mdco8N+y3+e4nBkY2mINQh2A6nbEBEPOEuKRnn4wvkK7bSr1i6ngducDvdk+pAS+jbmSB3TTkn6jExk/f7CK/UdG1SrD6O8PX9S/lJ5C+/4CvoylTWNlxSO5j5hv2dq+NSg/xKV/Mc1+6bT974Ug+84Hua+nCKwNobR5tofPKrz91J42Ti8q14cjsZK/aWhxi3p9P0+wL+pnPwWvr3WHseB7cDz9Dq3VutavWKwvOEtMQV04VSFCmVliN0+8+Z44rv/UuyuivtvvaW07RG4qJAHAB5HNVuo+jrpziO4K/w3Lq/k1eVhMJTjUdbEvPN8eC8jRUxV1aKsjh1owyGRhlJJgCAwmScAe5rqPY3o51t1dZeX+7WmnTpmLt0E/r4PFtJItg+7cnNpd+i3QNH7YDEqLkhhOQSQTB4wQa3S1bCqFUAKoAAAgAAQAB5CK9SvXjOzjuZW7nulKVjOClKUApSlAKUpQClKUApSlAKUpQClKUApSlAKUpQClKUApSlAKUpQClKUApSlAKUpQClKUApSlAKUpQClKUApSlAKUpQClKUApSlAKUpQClKUApSlAKUpQClKUApSlAKUpQClKUApSlAKUpQClKUApSlAKUpQClKUApSlAKUpQClKUApSlAKUpQClKUApSlAKUpQClKUB//Z" },
  {
    id: 4,
    name: "Burger Combo",
    price: "99,000đ",
    rating: 5,
    img: "https://images.unsplash.com/photo-1550317138-10000687a72b?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 5,
    name: "Asian Noodle Bowl",
    price: "79,000đ",
    rating: 4,
    img: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?auto=format&fit=crop&w=500&q=80",
  },
];

const CARDS_PER_VIEW = 3;

const StarRating = ({ count }) => (
  <div className="combo-star-rating">
    {[1, 2, 3, 4, 5].map((i) => (
      <svg
        key={i}
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill={i <= count ? "#f59e0b" : "#d1d5db"}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
      </svg>
    ))}
  </div>
);

const SmileIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" />
    <path
      d="M8 14s1.5 2 4 2 4-2 4-2"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="9" cy="10" r="1" fill="white" />
    <circle cx="15" cy="10" r="1" fill="white" />
  </svg>
);

const ComboDealSection = ({ userLocation, onChangeLocation }) => {
  const [startIdx, setStartIdx] = useState(0);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (item) => {
    addToCart({
      name: item.name,
      price: parseVND(item.price),
      quantity: 1,
      image: item.img,
    });
    toast.success(`Đã thêm "${item.name}" vào giỏ!`);
  };

  const handleBuyNow = (item) => {
    addToCart({
      name: item.name,
      price: parseVND(item.price),
      quantity: 1,
      image: item.img,
    });
    navigate("/checkout");
  };

  const visible = combos.slice(startIdx, startIdx + CARDS_PER_VIEW);
  const canPrev = startIdx > 0;
  const canNext = startIdx < combos.length - CARDS_PER_VIEW;

  if (!userLocation) return null;

  return (
    <section className="combo-deal-section">
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: "left", marginBottom: "20px" }}>
          <div className="combo-label-pill" style={{ margin: "0 0 10px 0" }}>Combo Deal</div>
        </div>

        {/* Cards */}
        <div className="combo-grid">
          {visible.map((item) => (
            <div className="combo-card" key={item.id}>
              {/* Smile icon top-right */}
              <div className="combo-smile-btn">
                <SmileIcon />
              </div>

              {/* Circular image */}
              <div className="combo-card-img">
                <img src={item.img} alt={item.name} />
              </div>

              {/* Card body */}
              <div className="combo-card-body">
                <div className="combo-card-top">
                  <span className="combo-name">{item.name}</span>
                  <button
                    className="combo-add-cart-btn"
                    onClick={() => handleAddToCart(item)}
                  >
                    Thêm vào giỏ
                  </button>
                </div>
                <div className="combo-card-bottom">
                  <StarRating count={item.rating} />
                  <div className="combo-price-row">
                    <span className="combo-price">{item.price}</span>
                    <button
                      className="combo-buy-now-btn"
                      onClick={() => handleBuyNow(item)}
                    >
                      Mua ngay
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="combo-nav">
          <button
            className="combo-nav-btn"
            onClick={() => setStartIdx((i) => Math.max(0, i - 1))}
            disabled={!canPrev}
            aria-label="Previous"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            className="combo-nav-btn"
            onClick={() =>
              setStartIdx((i) =>
                Math.min(combos.length - CARDS_PER_VIEW, i + 1),
              )
            }
            disabled={!canNext}
            aria-label="Next"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ComboDealSection;

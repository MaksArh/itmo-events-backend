import requests
from starlette import status

from tests.conftest import cookies


class TestUser:
    def test_add(self, get_base_url, get_one_user):
        method = "/api/user/add"
        user = get_one_user

        # cookies = "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIwSVliSmNVLW1wbEdBdzhFMzNSNkNKTUdWa3hZdUQ2eUItdWt3RlBJOXV3In0.eyJleHAiOjE2NzYxMDczMDksImlhdCI6MTY3NjEwNTUwOSwiYXV0aF90aW1lIjoxNjc2MTA1NTA5LCJqdGkiOiIzNTExZjA0YS05MjJhLTQ2ODEtYjRiMy0zM2VkM2JiZDQ1MmIiLCJpc3MiOiJodHRwczovL2lkLml0bW8ucnUvYXV0aC9yZWFsbXMvaXRtbyIsInN1YiI6IjI1ODgzOTE0LWI2MGEtNGY4Zi1hYjUxLTNiOTY4MzYzOTVkNyIsInR5cCI6IkJlYXJlciIsImF6cCI6InN0dWRlbnRzLXByb2plY3QtZXZlbnQtZGV2Iiwic2Vzc2lvbl9zdGF0ZSI6IjgzNDg0MzEyLTU5ZWQtNGVlMC1iMzYwLWMwNWVkYjkxNWQzMSIsImFjciI6IjEiLCJzY29wZSI6Im9wZW5pZCIsInNpZCI6IjgzNDg0MzEyLTU5ZWQtNGVlMC1iMzYwLWMwNWVkYjkxNWQzMSIsImlzdSI6Mjg0Njc5fQ.D8-c1wZPKHe0Ejw-2rRLgvaM1m61wjz7aici3kl2o4Df5D3BolWKSVT5DZ1emufjso0rQieP_6_eRzJ1vHNB7bwCqBEZyO-IwZfthaFXsBltdeZaNsOJKa0hzOWm9nlOyHJg33J3AvMAlasgSNRKlVn2i-vcEuyxrxTB0HmU3hTAMi83P6IzCPeIPA8QC2LG4usn3T-A955F2E9MPzrzv4VNFUep3AjvlXOcCIzEhA0RfBdSm03qC1dIRgO2A_GJRRhpJvrz8R44VG4qn1soGqr9Le0MwaW8eqh8H3hpqe_ecHr4lI-21OClVbwHlbUeDPeZsKL52jfusNKcQp1kLg"
        response = requests.post(get_base_url + method, json=user, cookies=cookies)

        assert response.status_code == status.HTTP_200_OK

    def test_get(self, get_base_url, get_one_user):
        method = "/api/user/get"
        user_isu = get_one_user["user_isu_number"]
        user_isu_dict = {'user_isu_number': user_isu}

        url_user_get = 'http://127.0.0.1:8080/api/user/get?user_isu_number=1001'
        response = requests.get(url_user_get, cookies=cookies)

        # response = requests.get(get_base_url + method, params=user_isu_dict, cookies=cookies)

        assert response.status_code == status.HTTP_200_OK

    def test_update(self, get_base_url, get_update_user):
        method = "/api/user/update"
        data_update = get_update_user

        response = requests.post(get_base_url + method, json=data_update, cookies=cookies)

        assert response.status_code == status.HTTP_200_OK

    def test_delete(self, get_base_url, get_one_user):
        method = "/api/user/delete"

        user_isu_number = get_one_user["user_isu_number"]
        user_isu_number_dict = {'user_isu_number': user_isu_number}

        response = requests.delete(get_base_url + method, json=user_isu_number_dict, cookies=cookies)
        assert response.status_code == 200

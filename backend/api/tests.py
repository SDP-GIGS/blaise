from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken
from api.models import CustomUser, InternshipPlacement, WeeklyLog


class AuthenticationTest(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.student = CustomUser.objects.create_user(
            username='2400700001',
            email='teststudent@test.com',
            full_name='Test Student',
            role='student',
            student_number='2400700001',
            password='Test1234!'
        )
        self.admin = CustomUser.objects.create_user(
            username='admin@test.com',
            email='admin@test.com',
            full_name='Test Admin',
            role='admin',
            password='Admin1234!'
        )

    def test_student_login_with_student_number(self):
        res = self.client.post('/api/auth/login/', {
            'identifier': '2400700001',
            'password': 'Test1234!'
        }, format='json')
        self.assertEqual(res.status_code, 200)
        self.assertIn('access', res.data)

    def test_login_wrong_password(self):
        res = self.client.post('/api/auth/login/', {
            'identifier': '2400700001',
            'password': 'wrongpassword'
        }, format='json')
        self.assertEqual(res.status_code, 401)

    def test_student_cannot_access_users_list(self):
        token = RefreshToken.for_user(self.student)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token.access_token}')
        res = self.client.get('/api/users/')
        self.assertEqual(res.status_code, 403)

    def test_admin_can_access_users_list(self):
        token = RefreshToken.for_user(self.admin)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token.access_token}')
        res = self.client.get('/api/users/')
        self.assertEqual(res.status_code, 200)

    def test_unauthenticated_request_rejected(self):
        res = self.client.get('/api/logs/')
        self.assertEqual(res.status_code, 401)


class PlacementTest(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.admin = CustomUser.objects.create_user(
            username='admin@test.com',
            email='admin@test.com',
            full_name='Test Admin',
            role='admin',
            password='Admin1234!'
        )
        self.student = CustomUser.objects.create_user(
            username='2400700002',
            email='teststudent2@test.com',
            full_name='Test Student 2',
            role='student',
            student_number='2400700002',
            password='Test1234!'
        )
        token = RefreshToken.for_user(self.admin)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token.access_token}')

    def test_create_placement_with_valid_dates(self):
        res = self.client.post('/api/placements/', {
            'student': self.student.id,
            'company': 'Test Company',
            'start_date': '2026-07-01',
            'end_date': '2026-09-01',
            'status': 'active'
        }, format='json')
        self.assertEqual(res.status_code, 201)

    def test_create_placement_with_past_start_date(self):
        res = self.client.post('/api/placements/', {
            'student': self.student.id,
            'company': 'Test Company',
            'start_date': '2025-01-01',
            'end_date': '2026-09-01',
            'status': 'active'
        }, format='json')
        self.assertEqual(res.status_code, 400)


class WeeklyLogTest(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.student = CustomUser.objects.create_user(
            username='2400700003',
            email='teststudent3@test.com',
            full_name='Test Student 3',
            role='student',
            student_number='2400700003',
            password='Test1234!'
        )
        self.placement = InternshipPlacement.objects.create(
            student=self.student,
            company='Test Company',
            start_date='2026-06-01',
            end_date='2026-09-01',
            status='active'
        )
        token = RefreshToken.for_user(self.student)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token.access_token}')

    def test_student_can_create_log(self):
        res = self.client.post('/api/logs/', {
            'placement': self.placement.id,
            'week_number': 1,
            'date': '2026-06-09',
            'activities': 'Worked on Django models',
            'learnings': 'Learned about ForeignKey',
            'challenges': 'Understanding migrations'
        }, format='json')
        self.assertEqual(res.status_code, 201)

    def test_duplicate_week_number_rejected(self):
        self.client.post('/api/logs/', {
            'placement': self.placement.id,
            'week_number': 1,
            'date': '2026-06-09',
            'activities': 'First log',
            'learnings': 'Something',
            'challenges': 'Nothing'
        }, format='json')
        res = self.client.post('/api/logs/', {
            'placement': self.placement.id,
            'week_number': 1,
            'date': '2026-06-09',
            'activities': 'Duplicate log',
            'learnings': 'Something',
            'challenges': 'Nothing'
        }, format='json')
        self.assertEqual(res.status_code, 400)

    def test_student_can_submit_draft_log(self):
        create_res = self.client.post('/api/logs/', {
            'placement': self.placement.id,
            'week_number': 2,
            'date': '2026-06-09',
            'activities': 'Test activities',
            'learnings': 'Test learnings',
            'challenges': 'Test challenges'
        }, format='json')
        log_id = create_res.data['id']
        submit_res = self.client.post(f'/api/logs/{log_id}/submit/')
        self.assertEqual(submit_res.status_code, 200)
        self.assertEqual(submit_res.data['status'], 'submitted')